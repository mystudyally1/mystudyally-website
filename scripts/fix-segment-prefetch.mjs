/**
 * Repairs the segment-prefetch filenames in the static export.
 *
 * Next 16.3.0's client asks for a route's prefetch payload with the segment
 * path flattened onto one filename:
 *
 *   GET /igcse/__next.$d$curriculum.__PAGE__.txt
 *
 * but `output: "export"` writes that same payload with the separator left as a
 * real path separator, so it lands in a nested directory instead:
 *
 *   out/igcse/__next.$d$curriculum/__PAGE__.txt
 *
 * On a plain file host nothing resolves the first URL to the second, so every
 * prefetch 404s — 14 of them on the homepage alone, on every page view. The
 * navigation still works (Next falls back to a full document load), so the
 * symptom is silent: wasted requests, a console full of 404s, and none of the
 * instant-navigation benefit the framework is asking for.
 *
 * This writes the flat filename alongside the nested one. Re-runnable.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "out");

if (!fs.existsSync(OUT)) {
  console.error("out/ not found — run `next build` first.");
  process.exit(1);
}

let written = 0;
let bytes = 0;

/** Every file under `dir`, as paths relative to it. */
function filesUnder(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? filesUnder(full, base) : [path.relative(base, full)];
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;

    if (entry.name.startsWith("__next.")) {
      for (const rel of filesUnder(full)) {
        // "$d$slug/__PAGE__.txt" -> "$d$slug.__PAGE__.txt"
        const flat = `${entry.name}.${rel.split(path.sep).join(".")}`;
        const target = path.join(dir, flat);
        const source = path.join(full, rel);
        fs.copyFileSync(source, target);
        written += 1;
        bytes += fs.statSync(source).size;
      }
      continue; // its children are payloads, not routes
    }
    walk(full);
  }
}

walk(OUT);
console.log(
  `Segment prefetch: wrote ${written} flat payload file(s), ${(bytes / 1024).toFixed(0)} KB.`,
);
