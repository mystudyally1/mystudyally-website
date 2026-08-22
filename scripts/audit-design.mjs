// Compares each built page against its design file and reports the height
// delta plus the heading sequence, so a section that is missing, reordered or
// laid out differently shows up as a number rather than a hunch.
//
// The exports ship a separate "<Page> Mobile.dc.html" for every page, so the
// two breakpoints are checked against different sources:
//
//   npm run audit:mobile  [slug]   390px  vs "<Page> Mobile.dc.html"
//   npm run audit:desktop [slug]  1280px  vs "<Page>.dc.html"
//
// Needs a browser: npm install --no-save playwright-core
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const ROOT = path.join(import.meta.dirname, "..");
const DESIGN = path.join(ROOT, "website design");
const OUT = path.join(ROOT, "out");
const SHOTS = path.join(ROOT, ".mobile-audit");

const DESKTOP = process.argv.includes("--desktop");
const WIDTH = DESKTOP ? 1280 : 390; // desktop container / iPhone 14 logical width

/** design file (without extension) -> built route */
const MOBILE_PAGES = [
  ["Homepage Mobile", "/"],
  ["About Mobile", "/about/"],
  ["Tutors Mobile", "/tutors/"],
  ["Pricing v2 Mobile", "/pricing/"],
  ["FAQ Mobile", "/faq/"],
  ["Blog Mobile", "/blog/"],
  ["Contact Mobile", "/contact/"],
  ["IGCSE Mobile", "/igcse/"],
  ["GCSE Mobile", "/gcse/"],
  ["A Levels Mobile", "/a-levels/"],
  ["IB Mobile", "/ib/"],
  ["SAT Mobile", "/sat/"],
  ["IELTS Mobile", "/ielts/"],
  ["HKDSE Mobile", "/hkdse/"],
  ["SABIS Mobile", "/sabis/"],
  ["American Curriculum Mobile", "/american-curriculum/"],
  ["Canadian Curriculum Mobile", "/canadian-curriculum/"],
];

const DESKTOP_PAGES = [
  ["MyStudyAlly Homepage", "/"],
  ["About", "/about/"],
  ["Tutors", "/tutors/"],
  ["Pricing v2", "/pricing/"],
  ["FAQ", "/faq/"],
  ["Blog", "/blog/"],
  ["Contact", "/contact/"],
  ["Subjects", "/subjects/"],
  ["IGCSE", "/igcse/"],
  ["GCSE", "/gcse/"],
  ["A Levels", "/a-levels/"],
  ["IB", "/ib/"],
  ["SAT", "/sat/"],
  ["IELTS", "/ielts/"],
  ["HKDSE", "/hkdse/"],
  ["SABIS", "/sabis/"],
  ["American Curriculum", "/american-curriculum/"],
  ["Canadian Curriculum", "/canadian-curriculum/"],
];

const PAGES = DESKTOP ? DESKTOP_PAGES : MOBILE_PAGES;

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp4": "video/mp4",
  ".ico": "image/x-icon", ".json": "application/json",
};

function serve(root, port) {
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(root, p);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, "index.html");
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      return res.end("not found");
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    res.end(fs.readFileSync(file));
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

/** Headings plus the section structure, for comparing shape not styling. */
const SNAPSHOT = () => {
  const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
  return {
    height: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    headings: [...document.querySelectorAll("h1,h2,h3")]
      .map((h) => `${h.tagName} ${norm(h.textContent).slice(0, 60)}`)
      .filter((h) => h.length > 4),
  };
};

/** Screenshots are a debugging aid; a slow one must not abort the measurement. */
async function shoot(page, file) {
  try {
    await page.screenshot({ path: file, fullPage: true, timeout: 15000 });
  } catch {
    // a very tall page can outrun the font-settle wait — the numbers still hold
  }
}

const only = process.argv.slice(2).find((a) => !a.startsWith("--"));
const pages = only
  ? PAGES.filter(([, route]) => route.includes(only) || route === `/${only}/`)
  : PAGES;

if (!only) fs.rmSync(SHOTS, { recursive: true, force: true });
fs.mkdirSync(SHOTS, { recursive: true });

const designServer = await serve(DESIGN, 8930);
const buildServer = await serve(OUT, 8931);
// playwright-core ships no browser; CHROME_PATH lets a system Chrome stand in.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);

console.log(`Comparing ${pages.length} page(s) at ${WIDTH}px.\n`);
console.log("page                     design    build    delta   overflow  headings");

const report = [];
for (const [file, route] of pages) {
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: 900 },
    deviceScaleFactor: DESKTOP ? 1 : 2,
    isMobile: !DESKTOP,
    hasTouch: !DESKTOP,
  });

  const dPage = await ctx.newPage();
  await dPage.goto(`http://localhost:8930/${encodeURIComponent(file)}.dc.html`, {
    waitUntil: "load",
    timeout: 30000,
  });
  await dPage.waitForTimeout(2500);
  const design = await dPage.evaluate(SNAPSHOT);
  await shoot(dPage, path.join(SHOTS, `${route.replace(/\//g, "_")}${DESKTOP ? "desktop-" : ""}design.png`));
  await dPage.close();

  const bPage = await ctx.newPage();
  await bPage.goto(`http://localhost:8931${route}`, { waitUntil: "load", timeout: 30000 });
  await bPage.waitForTimeout(1200);
  const build = await bPage.evaluate(SNAPSHOT);
  await shoot(bPage, path.join(SHOTS, `${route.replace(/\//g, "_")}${DESKTOP ? "desktop-" : ""}build.png`));
  await bPage.close();
  await ctx.close();

  const delta = build.height - design.height;
  const pct = design.height ? ((delta / design.height) * 100).toFixed(1) : "?";
  const missing = design.headings.filter((h) => !build.headings.includes(h));
  const extra = build.headings.filter((h) => !design.headings.includes(h));

  console.log(
    `${route.padEnd(24)} ${String(design.height).padStart(6)}  ${String(build.height).padStart(6)}  ` +
      `${(delta > 0 ? "+" : "") + pct}%`.padStart(8) +
      `  ${String(build.overflow).padStart(6)}    ${design.headings.length}/${build.headings.length}` +
      (missing.length ? `  MISSING ${missing.length}` : "") +
      (extra.length ? `  EXTRA ${extra.length}` : ""),
  );

  report.push({ route, design, build, delta, pct, missing, extra });
}

await browser.close();
designServer.close();
buildServer.close();

fs.writeFileSync(
  path.join(SHOTS, DESKTOP ? "report-desktop.json" : "report.json"),
  JSON.stringify(report, null, 2),
);

console.log(`\nScreenshots and report.json in .mobile-audit/`);
for (const r of report) {
  if (r.missing.length || r.extra.length) {
    console.log(`\n${r.route}`);
    r.missing.forEach((h) => console.log(`  only in design: ${h}`));
    r.extra.forEach((h) => console.log(`  only in build : ${h}`));
  }
}
