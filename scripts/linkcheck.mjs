// Walks the static export and verifies every internal href resolves to a file.
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

function exists(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return fs.existsSync(path.join(OUT, "index.html"));
  const rel = clean.replace(/^\//, "");
  const candidates = [
    path.join(OUT, rel, "index.html"),
    path.join(OUT, rel),
    path.join(OUT, rel + ".html"),
    path.join(OUT, rel.replace(/\/$/, "") + ".html"),
  ];
  return candidates.some((c) => fs.existsSync(c));
}

const pages = walk(OUT);
const broken = [];
const seen = new Set();

for (const file of pages) {
  const html = fs.readFileSync(file, "utf-8");
  const rel = "/" + path.relative(OUT, file).replace(/\\/g, "/");
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#") ||
      href.startsWith("data:") ||
      href.startsWith("/_next/")
    )
      continue;
    if (!exists(href)) {
      const key = rel + " -> " + href;
      if (!seen.has(key)) {
        seen.add(key);
        broken.push({ page: rel, href });
      }
    }
  }
}

console.log(`Scanned ${pages.length} pages.`);
if (broken.length === 0) {
  console.log("No broken internal links.");
} else {
  console.log(`\n${broken.length} BROKEN LINKS:`);
  for (const b of broken) console.log(`  ${b.page}  ->  ${b.href}`);
}
