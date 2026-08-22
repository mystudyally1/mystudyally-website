/**
 * Submits recently-changed URLs to IndexNow.
 *
 * IndexNow is a push protocol: instead of waiting for a crawler to rediscover a
 * changed page, the site tells the engine directly. Bing, Yandex, Seznam and
 * Naver consume it (one submission fans out to all of them). Google does not
 * participate — this does nothing for Google, and the sitemap remains the only
 * signal there.
 *
 * Ownership is proved by hosting a file at `/{key}.txt` whose contents are the
 * key. That file lives in `public/` and ships with the export.
 *
 *   node scripts/indexnow-submit.mjs              # URLs changed in the last 7 days
 *   node scripts/indexnow-submit.mjs --days 30
 *   node scripts/indexnow-submit.mjs --all
 *   node scripts/indexnow-submit.mjs --dry-run
 *
 * Deliberately not part of `npm run build`: a build is not a deploy, and
 * announcing a URL that has not shipped yet is worse than announcing it late.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "out");
const SITE_URL = "https://mystudyally.com";
const HOST = new URL(SITE_URL).host;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const days = Number(args[args.indexOf("--days") + 1]) || 7;

/** The key is the basename of the single `<hex>.txt` file in public/. */
function findKey() {
  const publicDir = path.join(import.meta.dirname, "..", "public");
  const keys = fs
    .readdirSync(publicDir)
    .filter((f) => /^[0-9a-f]{8,128}\.txt$/.test(f))
    .map((f) => f.replace(/\.txt$/, ""));
  if (keys.length === 0) {
    throw new Error(
      "No IndexNow key file found in public/. Create one named <key>.txt whose contents are the key.",
    );
  }
  if (keys.length > 1) {
    throw new Error(`Multiple IndexNow key files in public/: ${keys.join(", ")}. Keep exactly one.`);
  }
  const key = keys[0];
  const contents = fs.readFileSync(path.join(publicDir, `${key}.txt`), "utf-8").trim();
  if (contents !== key) {
    throw new Error(
      `public/${key}.txt must contain exactly the key "${key}" — IndexNow verifies by fetching it.`,
    );
  }
  return key;
}

const sitemapPath = path.join(OUT, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.error("No out/sitemap.xml — run `npm run build` first.");
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, "utf-8");
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
  loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));

const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
const urlList = entries
  .filter((e) => e.loc && (all || !e.lastmod || new Date(e.lastmod).getTime() >= cutoff))
  .map((e) => e.loc);

if (urlList.length === 0) {
  console.log(`Nothing changed in the last ${days} day(s). Use --all to submit everything.`);
  process.exit(0);
}

const key = findKey();
const payload = { host: HOST, key, keyLocation: `${SITE_URL}/${key}.txt`, urlList };

console.log(
  `${dryRun ? "[dry run] would submit" : "Submitting"} ${urlList.length} URL(s) to IndexNow:`,
);
for (const u of urlList) console.log(`  ${u}`);

if (dryRun) process.exit(0);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

// 200 = accepted, 202 = accepted but key still being validated. Both are fine.
if (res.status === 200 || res.status === 202) {
  console.log(`\nAccepted (HTTP ${res.status}).`);
  process.exit(0);
}
console.error(`\nIndexNow returned HTTP ${res.status}: ${await res.text()}`);
process.exit(1);
