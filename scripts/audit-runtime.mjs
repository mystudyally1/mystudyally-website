// Browser-driven audit of the built export: renders every route at three
// widths with the vercel.json security headers applied, and reports CSP
// violations, console errors, failed requests, horizontal overflow, duplicate
// ids, heading-order jumps, broken images and missing landmarks.
//
// Needs a browser, so it is deliberately outside `npm run verify`:
//   npm install --no-save playwright-core && npm run audit:runtime

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const OUT = path.join(import.meta.dirname, "..", "out");
const PORT = 8911;

// Read from vercel.json rather than restated here: a copy in this file would
// drift from the policy that actually ships, and the audit would then pass
// against a policy no browser ever sees.
const VERCEL_CONFIG = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "..", "vercel.json"), "utf8"),
);
const CSP = VERCEL_CONFIG.headers
  .flatMap((rule) => rule.headers)
  .find((h) => h.key === "Content-Security-Policy")?.value;
if (!CSP) {
  console.error("No Content-Security-Policy found in vercel.json — nothing to audit against.");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp4": "video/mp4", ".ico": "image/x-icon",
  ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json",
};

/**
 * Resolves Next 16's segment-prefetch payloads the way Vercel does.
 *
 * The client asks for the payload with the segment path flattened onto one
 * filename (`/igcse/__next.$d$curriculum.__PAGE__.txt`) while `output: "export"`
 * writes it into a nested directory (`__next.$d$curriculum/__PAGE__.txt`).
 * Vercel reconciles the two itself, so these resolve in production; a plain
 * file server does not, and without this every route would report a dozen
 * broken requests that the deployment never sees.
 */
function segmentPrefetchFallback(file) {
  const dir = path.dirname(file);
  const parts = path.basename(file).split(".");
  if (!parts[0].startsWith("__next") || parts.length < 3) return file;
  // Any of the dots may have been a path separator before flattening, and a
  // nested route uses more than one ("__next.blog.$d$slug.__PAGE__.txt" is
  // "__next.blog/$d$slug/__PAGE__.txt"). The extension is always a real dot,
  // so try every combination for the rest — at most a handful of candidates.
  const gaps = parts.length - 2;
  for (let mask = 0; mask < 1 << gaps; mask += 1) {
    let rel = parts[0];
    for (let i = 0; i < gaps; i += 1) {
      rel += (mask & (1 << i) ? path.sep : ".") + parts[i + 1];
    }
    rel += `.${parts[parts.length - 1]}`;
    const candidate = path.join(dir, rel);
    if (fs.existsSync(candidate)) return candidate;
  }
  return file;
}

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);

  // Vercel serves /_vercel/* from the edge, so it exists on a deployment but
  // never in the export. Speed Insights asks for its script from there on
  // every page; without this stub each route reports a broken request here and
  // the real failures get lost in the noise.
  if (p.startsWith("/_vercel/")) {
    res.writeHead(200, { "Content-Type": "text/javascript", "Content-Security-Policy": CSP });
    res.end("");
    return;
  }
  let file = path.join(OUT, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) file = segmentPrefetchFallback(file);
  if (!fs.existsSync(file)) {
    res.writeHead(404, { "Content-Type": "text/html", "Content-Security-Policy": CSP });
    return res.end(fs.readFileSync(path.join(OUT, "404.html")));
  }
  res.writeHead(200, {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
    "Content-Security-Policy": CSP,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  res.end(fs.readFileSync(file));
});

await new Promise((r) => server.listen(PORT, r));

const routes = [
  "/", "/subjects/", "/tutors/", "/pricing/", "/about/", "/contact/", "/faq/",
  "/blog/", "/blog/when-to-start-tutoring/", "/blog/tag/for-parents/",
  "/igcse/", "/gcse/", "/a-levels/", "/ib/", "/sat/", "/ielts/", "/hkdse/",
  "/american-curriculum/", "/canadian-curriculum/", "/sabis/",
  "/terms/", "/privacy/", "/thank-you/", "/does-not-exist/",
];

const widths = [360, 768, 1280];
// playwright-core ships no browser. Use a system Chrome when CHROME_PATH
// points at one, so this runs without a separate ~150 MB download.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const problems = [];

for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  for (const route of routes) {
    const page = await ctx.newPage();
    const seen = [];
    page.on("console", (m) => {
      const t = m.text();
      // The bare "Failed to load resource" lines duplicate the response hook,
      // which reports the actual URL and status.
      if (m.type() === "error" && !t.startsWith("Failed to load resource"))
        seen.push(`console: ${t.slice(0, 160)}`);
    });
    page.on("pageerror", (e) => seen.push(`pageerror: ${String(e).slice(0, 160)}`));
    page.on("requestfailed", (r) => {
      const err = r.failure()?.errorText ?? "";
      // Turnstile is keyed to mystudyally.com, so it cannot verify on localhost.
      if (r.url().includes("challenges.cloudflare.com")) return;
      // Next cancels in-flight route prefetches when the page tears down.
      if (err === "net::ERR_ABORTED") return;
      seen.push(`requestfailed: ${r.url().slice(0, 100)} (${err})`);
    });
    page.on("response", (r) => {
      // /does-not-exist/ is in the route list on purpose, to prove the branded
      // 404 renders; its 404 status is the expected result, not a fault.
      if (r.status() >= 400 && !r.url().endsWith("/does-not-exist/"))
        seen.push(`HTTP ${r.status()}: ${r.url().slice(0, 110)}`);
    });

    // "load", not "networkidle": the Turnstile script is fetched cross-origin
    // and never settles here, since the site key is bound to mystudyally.com.
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "load", timeout: 20000 });
    await page.waitForTimeout(600);

    const audit = await page.evaluate(() => {
      const out = {};
      out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;

      const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
      out.dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);

      const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
        Number(h.tagName[1]),
      );
      out.headingJumps = levels
        .map((l, i) => (i > 0 && l - levels[i - 1] > 1 ? `h${levels[i - 1]}->h${l}` : null))
        .filter(Boolean);

      out.brokenImgs = [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src);

      out.emptyLinks = [...document.querySelectorAll("a")].filter(
        (a) => !a.textContent.trim() && !a.getAttribute("aria-label") && !a.querySelector("img,svg"),
      ).length;

      out.hasMain = !!document.querySelector("main");
      out.title = document.title;
      return out;
    });

    const tag = `[${width}] ${route}`;
    seen.forEach((m) => problems.push(`${tag} ${m}`));
    if (audit.overflow > 1) problems.push(`${tag} horizontal overflow ${audit.overflow}px`);
    if (audit.dupIds.length) problems.push(`${tag} duplicate id(s): ${[...new Set(audit.dupIds)].join(", ")}`);
    if (audit.headingJumps.length) problems.push(`${tag} heading jump ${audit.headingJumps.join(", ")}`);
    if (audit.brokenImgs.length) problems.push(`${tag} broken image ${audit.brokenImgs.join(", ")}`);
    if (audit.emptyLinks) problems.push(`${tag} ${audit.emptyLinks} link(s) with no accessible name`);
    if (!audit.hasMain) problems.push(`${tag} no <main> landmark`);
    if (!audit.title) problems.push(`${tag} empty <title>`);

    await page.close();
  }
  await ctx.close();
}

await browser.close();
server.close();

console.log(`Checked ${routes.length} routes at ${widths.join("/")}px.\n`);
if (!problems.length) console.log("No runtime problems found.");
else {
  console.log(`${problems.length} problem(s):`);
  [...new Set(problems)].forEach((p) => console.log("  " + p));
}
