// Side-by-side strips of a mobile design and the build, at a given scroll
// depth — for eyeballing what the height numbers cannot tell you.
//
//   node scripts/audit-mobile-strip.mjs "Homepage Mobile" / 0 900
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, ".mobile-audit");
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

const [file, route, scrollArg, heightArg] = process.argv.slice(2);
const scrollY = Number(scrollArg ?? 0);
const height = Number(heightArg ?? 900);

const d = await serve(path.join(ROOT, "website design"), 8950);
const b = await serve(path.join(ROOT, "out"), 8951);
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height },
  isMobile: true,
  hasTouch: true,
});

async function shot(url, wait) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(wait);
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(400);
  const buf = await page.screenshot();
  await page.close();
  return buf;
}

const designPng = await shot(`http://localhost:8950/${encodeURIComponent(file)}.dc.html`, 2500);
const buildPng = await shot(`http://localhost:8951${route}`, 1200);

await browser.close();
d.close();
b.close();

fs.mkdirSync(OUT, { recursive: true });
const label = `${route.replace(/\//g, "_") || "_"}${scrollY}`;
const target = path.join(OUT, `strip${label}.png`);

// Design on the left, build on the right, with a divider between them.
await sharp({
  create: { width: 390 * 2 + 8, height, channels: 3, background: "#888888" },
})
  .composite([
    { input: designPng, top: 0, left: 0 },
    { input: buildPng, top: 0, left: 398 },
  ])
  .png()
  .toFile(target);

console.log(`wrote ${target}  (left = design, right = build)`);
