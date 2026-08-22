// Section-level height comparison between a mobile design file and the build.
// The page total tells you something is off; this tells you where.
//
//   npm install --no-save playwright-core
//   node scripts/audit-mobile-sections.mjs "Pricing v2 Mobile" /pricing/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const ROOT = path.join(import.meta.dirname, "..");
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
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      return res.end("not found");
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    res.end(fs.readFileSync(file));
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

/** Top-level blocks with their height and first heading, in document order. */
const SECTIONS = (rootSel) => {
  const host = document.querySelector(rootSel) ?? document.body;
  const kids = [...host.children].filter((n) => n.getBoundingClientRect().height > 4);
  return kids.map((n) => {
    const h = n.querySelector("h1,h2,h3");
    const label =
      n.getAttribute("data-screen-label") ||
      (h ? h.textContent.replace(/\s+/g, " ").trim().slice(0, 44) : n.tagName.toLowerCase());
    return { label, height: Math.round(n.getBoundingClientRect().height) };
  });
};

const [file, route] = process.argv.slice(2);
if (!file || !route) {
  console.error('usage: node scripts/audit-mobile-sections.mjs "<Design File>" /route/');
  process.exit(1);
}

const d = await serve(path.join(ROOT, "website design"), 8940);
const b = await serve(path.join(ROOT, "out"), 8941);
// playwright-core ships no browser; CHROME_PATH lets a system Chrome stand in.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true });

const dp = await ctx.newPage();
await dp.goto(`http://localhost:8940/${encodeURIComponent(file)}.dc.html`, { waitUntil: "load" });
await dp.waitForTimeout(2500);
const design = await dp.evaluate(SECTIONS, "[data-msa-shell]");
await dp.close();

const bp = await ctx.newPage();
await bp.goto(`http://localhost:8941${route}`, { waitUntil: "load" });
await bp.waitForTimeout(1200);
const build = await bp.evaluate(SECTIONS, "main");
await bp.close();

await browser.close();
d.close();
b.close();

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const rows = Math.max(design.length, build.length);
console.log(`\n${pad("DESIGN section", 40)} px      ${pad("BUILD section", 40)} px`);
console.log("-".repeat(100));
for (let i = 0; i < rows; i++) {
  const dd = design[i] ?? { label: "", height: "" };
  const bb = build[i] ?? { label: "", height: "" };
  console.log(
    `${pad(dd.label, 40)} ${String(dd.height).padStart(5)}   ${pad(bb.label, 40)} ${String(bb.height).padStart(5)}`,
  );
}
const sum = (a) => a.reduce((n, x) => n + x.height, 0);
console.log("-".repeat(100));
console.log(`${pad("TOTAL", 40)} ${String(sum(design)).padStart(5)}   ${pad("TOTAL", 40)} ${String(sum(build)).padStart(5)}`);
