/**
 * One-off generator for the brand assets that browsers and social platforms
 * ask for but the design files never produced: the favicon set and the
 * Open Graph share card.
 *
 * Not part of `npm run verify` — the outputs are committed. Re-run only when
 * the mark or the tagline changes:
 *
 *   npm install --no-save playwright-core
 *   node scripts/gen-brand-assets.mjs
 *
 * Rendering goes through Chromium rather than an SVG rasteriser so the card
 * uses real Nunito, matching the site.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const root = path.join(import.meta.dirname, "..");
const appDir = path.join(root, "src", "app");
const publicDir = path.join(root, "public");

const GREEN = "#58CC02";
const SHADOW = "#58A700";
const INK = "#131F24";
const MUTED = "#777777";

// The mark: white "M" on the brand green, drawn as a path so the icon needs no
// font to render at any size.
const markSvg = (size, radius) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${radius}" fill="${GREEN}"/>
  <path d="M14 46V19.5c0-1 .8-1.8 1.8-1.8h4.1c.7 0 1.4.4 1.7 1.1L32 39.2l10.4-20.4c.3-.7 1-1.1 1.7-1.1h4.1c1 0 1.8.8 1.8 1.8V46c0 .7-.6 1.3-1.3 1.3h-4.3c-.7 0-1.3-.6-1.3-1.3V31.6l-7.6 14.8c-.3.6-.9.9-1.5.9h-3c-.6 0-1.2-.3-1.5-.9L21.9 31.6V46c0 .7-.6 1.3-1.3 1.3h-4.3c-.7 0-1.3-.6-1.3-1.3z" fill="#fff"/>
</svg>`;

fs.writeFileSync(path.join(appDir, "icon.svg"), markSvg(64, 14));

// apple-touch-icon is composited on the home screen without rounding applied by
// older iOS, so it gets a smaller radius and full bleed.
const appleIcon = await sharp(Buffer.from(markSvg(180, 12))).png().toBuffer();
fs.writeFileSync(path.join(appDir, "apple-icon.png"), appleIcon);

// A real .ico for the browsers and crawlers that still request /favicon.ico by
// path. ICO can carry PNG payloads directly, so this is a header plus entries.
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map((s) => sharp(Buffer.from(markSvg(s, 3))).png().toBuffer()),
);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(icoSizes.length, 4);
let offset = 6 + 16 * icoSizes.length;
const entries = icoSizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s === 256 ? 0 : s, 0);
  e.writeUInt8(s === 256 ? 0 : s, 1);
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(icoImages[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += icoImages[i].length;
  return e;
});
fs.writeFileSync(
  path.join(appDir, "favicon.ico"),
  Buffer.concat([header, ...entries, ...icoImages]),
);

// ---- Open Graph share card -------------------------------------------------

const card = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=block" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;font-family:Nunito,sans-serif;background:#fff;
       position:relative;overflow:hidden;display:flex;flex-direction:column;
       justify-content:center;padding:0 84px}
  .blob{position:absolute;top:-220px;right:-160px;width:620px;height:620px;border-radius:50%;
        background:radial-gradient(circle,rgba(88,204,2,.16) 0%,rgba(88,204,2,0) 70%)}
  .mark{width:96px;height:96px;border-radius:26px;background:${GREEN};
        box-shadow:0 6px 0 ${SHADOW};display:flex;align-items:center;justify-content:center;
        color:#fff;font-size:56px;font-weight:900;line-height:1}
  h1{margin-top:38px;font-size:72px;font-weight:900;color:${INK};letter-spacing:-.03em;line-height:1}
  p{margin-top:20px;font-size:34px;font-weight:600;color:${MUTED};letter-spacing:-.01em}
  .chips{margin-top:38px;display:flex;gap:12px}
  .chip{border:2px solid #E5E5E5;border-radius:999px;padding:10px 22px;
        font-size:22px;font-weight:800;color:#3C3C3C}
  .url{position:absolute;left:84px;bottom:56px;font-size:24px;font-weight:800;color:${GREEN}}
  .bar{position:absolute;left:0;right:0;bottom:0;height:14px;background:${GREEN}}
</style></head>
<body>
  <div class="blob"></div>
  <div class="mark">M</div>
  <h1>MyStudyAlly</h1>
  <p>Curriculum-matched tutoring, done properly</p>
  <div class="chips">
    <span class="chip">IGCSE</span><span class="chip">GCSE</span><span class="chip">A Levels</span>
    <span class="chip">IB</span><span class="chip">SAT</span><span class="chip">IELTS</span>
  </div>
  <div class="url">mystudyally.com</div>
  <div class="bar"></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(card, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();

// PNG keeps the flat colours crisp; ~40KB is well under every platform's limit.
fs.writeFileSync(path.join(publicDir, "og.png"), await sharp(png).png({ quality: 90 }).toBuffer());

console.log("Wrote src/app/icon.svg, apple-icon.png, favicon.ico and public/og.png");
