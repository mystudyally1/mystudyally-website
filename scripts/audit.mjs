// Audits the built static export for leaked placeholders, stale pricing,
// SLA inconsistencies, and duplicate/missing SEO metadata.
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "out");

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".html")) files.push(p);
  }
  return files;
}

const pages = walk(OUT);
const problems = [];
const titles = new Map();
const descs = new Map();

// Visible text only — strip scripts/styles/tags.
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}

const PLACEHOLDER_PATTERNS = [
  /\[POLICY PENDING\]/i,
  /\[Confirm[^\]]*\]/i,
  /\[Quote about[^\]]*\]/i,
  /\[First name\][^,]*/i,
  /\[Match to real[^\]]*\]/i,
  /lorem ipsum/i,
  /TODO/,
  /PLACEHOLDER/i,
  /\+__ ____ ______/,
];

// Pricing must match src/data/pricing.ts, not the widget's obsolete numbers.
const STALE_PRICING = [/\$660/, /\$1,?620/, /\$33 an hour/, /\$27 an hour/, /20 hours at/];

for (const file of pages) {
  const rel = "/" + path.relative(OUT, file).replace(/\\/g, "/");
  const html = fs.readFileSync(file, "utf-8");
  const text = visibleText(html);

  for (const re of PLACEHOLDER_PATTERNS) {
    const m = text.match(re);
    if (m) problems.push(`PLACEHOLDER  ${rel}: "${m[0].slice(0, 70)}"`);
  }
  for (const re of STALE_PRICING) {
    const m = text.match(re);
    if (m) problems.push(`STALE PRICE  ${rel}: "${m[0]}"`);
  }
  // SLA must be the single canonical value.
  if (/within 2 hours/i.test(text)) problems.push(`SLA CONFLICT ${rel}: "within 2 hours"`);
  if (/04:00[–-]18:00/.test(text)) problems.push(`SLA CONFLICT ${rel}: old office-hours caveat`);

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) problems.push(`NO TITLE    ${rel}`);
  else {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(rel);
  }
  if (!desc) problems.push(`NO DESC     ${rel}`);
  else {
    if (!descs.has(desc)) descs.set(desc, []);
    descs.get(desc).push(rel);
    if (desc.length > 170) problems.push(`LONG DESC   ${rel}: ${desc.length} chars`);
  }

  // JSON-LD must parse.
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      problems.push(`BAD JSONLD  ${rel}: ${e.message.slice(0, 60)}`);
    }
  }
}

// Next emits the same 404 at /404.html, /404/, and /_not-found/ — one page.
const isNotFound = (p) => /^\/(404(\.html|\/index\.html)|_not-found\/index\.html)$/.test(p);
const dedupe = (list) => {
  const real = list.filter((p) => !isNotFound(p));
  return list.some(isNotFound) ? [...real, "(404)"] : real;
};

for (const [t, list] of titles) {
  if (dedupe(list).length > 1) {
    problems.push(`DUP TITLE   "${t.slice(0, 50)}" on ${dedupe(list).join(", ")}`);
  }
}
for (const list of descs.values()) {
  if (dedupe(list).length > 1) problems.push(`DUP DESC    on ${dedupe(list).join(", ")}`);
}

console.log(`Audited ${pages.length} pages.\n`);
if (problems.length === 0) console.log("✓ No problems found.");
else {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((p) => console.log("  " + p));
}
