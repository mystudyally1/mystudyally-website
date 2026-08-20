// Browser-driven audit of the built export: renders every route at three
// widths with the .htaccess security headers applied, and reports CSP
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

const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; " +
  "style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; " +
  "media-src 'self'; connect-src 'self' https://challenges.cloudflare.com " +
  "https://mystudyally-forms-worker.mystudyally1.workers.dev https://forms.mystudyally.com; " +
  "frame-src https://challenges.cloudflare.com; form-action 'self'; base-uri 'self'; " +
  "object-src 'none'; frame-ancestors 'self'";

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp4": "video/mp4", ".ico": "image/x-icon",
  ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json",
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(OUT, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
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
const browser = await chromium.launch();
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
