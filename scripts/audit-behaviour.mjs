// Behavioural checks for the interactive pieces the static audits cannot see:
// skip link, mobile drawer focus trap, chat focus handling, the Turnstile
// fallback when the challenge is blocked, reduced-motion video suppression and
// resilience to blocked storage.
//
// Needs a browser, so it is deliberately outside `npm run verify`:
//   npm install --no-save playwright-core && npm run audit:behaviour

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const OUT = path.join(import.meta.dirname, "..", "out");
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".woff2":"font/woff2",
  ".webp":"image/webp", ".png":"image/png", ".svg":"image/svg+xml", ".mp4":"video/mp4",
  ".ico":"image/x-icon", ".txt":"text/plain", ".xml":"application/xml" };

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(OUT, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(8913, r));
const BASE = "http://localhost:8913";
const results = [];
const check = (name, pass, detail = "") =>
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);

const browser = await chromium.launch();

// ---- 1. Skip link is reachable and moves focus ------------------------------
{
  const page = await browser.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => {
    const a = document.activeElement;
    return { text: a?.textContent?.trim(), visible: a?.getBoundingClientRect().width > 0 };
  });
  check("skip link is the first tab stop", focused.text === "Skip to content", focused.text);
  check("skip link becomes visible on focus", focused.visible === true);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  check("skip link targets <main>", (await page.evaluate(() => location.hash)) === "#main");
  await page.close();
}

// ---- 2. Mobile drawer: focus trap, Escape, focus restore --------------------
{
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.click('button[aria-label="Open menu"]');
  await page.waitForTimeout(250);
  check("drawer takes focus on open",
    (await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))) === "Close menu");
  check("drawer is a modal dialog",
    (await page.locator('[role="dialog"][aria-modal="true"]').count()) === 1);

  // Tab past the last control and confirm focus wraps back inside.
  for (let i = 0; i < 40; i++) await page.keyboard.press("Tab");
  check("focus stays inside the drawer",
    await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')));

  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  check("Escape closes the drawer", (await page.locator('[role="dialog"]').count()) === 0);
  check("focus returns to the menu button",
    (await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))) === "Open menu");
  await page.close();
}

// ---- 3. Chat: focus in on open, back to launcher on close -------------------
{
  const page = await browser.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.click('button[aria-label="Open chat"]');
  await page.waitForTimeout(250);
  check("chat takes focus on open",
    (await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))) === "Close chat");
  check("chat replies are a live region",
    (await page.locator('[role="log"][aria-live="polite"]').count()) === 1);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check("Escape closes the chat",
    (await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))) === "Open chat");
  await page.close();
}

// ---- 4. Turnstile blocked: form offers a working alternative ----------------
{
  const page = await browser.newPage();
  await page.route("**/challenges.cloudflare.com/**", (r) => r.abort());
  await page.goto(`${BASE}/contact/`, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  const body = await page.locator("body").innerText();
  check("blocked challenge is explained", body.includes("verification challenge could not load"));
  check("blocked challenge offers WhatsApp",
    (await page.locator('a[href^="https://wa.me/"]:visible').count()) > 0);
  check("no dead submit button is left behind",
    (await page.locator('button[type="submit"]:disabled').count()) === 0);
  await page.close();
}

// ---- 5. Reduced motion: no video is fetched ---------------------------------
{
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  const media = [];
  page.on("request", (r) => { if (r.url().endsWith(".mp4")) media.push(r.url()); });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  check("reduced motion downloads no video", media.length === 0, media.join(", "));
  await page.close();
}

// ---- 6. Normal motion: the video does load and play -------------------------
{
  const page = await browser.newPage();
  const media = [];
  page.on("request", (r) => { if (r.url().endsWith(".mp4")) media.push(r.url()); });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2500);
  check("normal motion still loads the video", media.length > 0);
  check("video is playing",
    await page.evaluate(() => [...document.querySelectorAll("video")].some((v) => !v.paused)));
  await page.close();
}

// ---- 7. Storage disabled: attribution does not take the page down -----------
{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() { throw new DOMException("blocked", "SecurityError"); },
    });
  });
  await page.goto(`${BASE}/contact/`, { waitUntil: "load" });
  await page.waitForTimeout(600);
  check("blocked storage does not throw", errors.length === 0, errors.join(" | "));
  await page.close();
}

await browser.close();
server.close();
results.forEach((r) => console.log(r));
const failed = results.filter((r) => r.startsWith("FAIL")).length;
console.log(`\n${results.length - failed}/${results.length} passed.`);
process.exit(failed ? 1 : 0);
