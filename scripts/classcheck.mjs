// Finds Tailwind utility classes used in source that produced NO CSS rule —
// i.e. silently dead classes (wrong scale value, typo'd token).
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(import.meta.dirname, "..", "src");
const OUT = path.join(import.meta.dirname, "..", "out");

function walk(dir, exts, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, files);
    else if (exts.some((x) => e.name.endsWith(x))) files.push(p);
  }
  return files;
}

// Gather the CSS actually shipped.
const cssFiles = walk(path.join(OUT, "_next"), [".css"]);
const css = cssFiles.map((f) => fs.readFileSync(f, "utf-8")).join("\n");

// Tailwind escapes special chars in selectors (".py-2\.5"). Strip the escape
// backslashes once so a plain substring match on the class name works.
const cssPlain = css.replace(/\\/g, "");

const sources = walk(SRC, [".tsx", ".ts"]);
const used = new Map(); // class -> files

for (const file of sources) {
  const text = fs.readFileSync(file, "utf-8");
  for (const m of text.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g)) {
    const raw = (m[1] ?? m[2] ?? m[3] ?? "").replace(/\$\{[^}]*\}/g, " ");
    for (const cls of raw.split(/\s+/)) {
      if (!cls || cls.includes("${")) continue;
      if (!used.has(cls)) used.set(cls, new Set());
      used.get(cls).add(path.relative(SRC, file).replace(/\\/g, "/"));
    }
  }
  // also cn("...") string literals
  for (const m of text.matchAll(/"([a-z0-9-]+(?:\s+[a-z0-9:./[\]#()-]+)*)"/gi)) {
    const raw = m[1];
    if (!/(^|\s)(flex|grid|text-|bg-|border|rounded|p[xytblr]?-|m[xytblr]?-|gap-|h-|w-|shadow|hover:|absolute|relative|inline)/.test(raw))
      continue;
    for (const cls of raw.split(/\s+/)) {
      if (!cls) continue;
      if (!used.has(cls)) used.set(cls, new Set());
      used.get(cls).add(path.relative(SRC, file).replace(/\\/g, "/"));
    }
  }
}

// Classes we shouldn't expect in CSS (not utilities).
const IGNORE = /^(group|peer|sr-only|container|prose|scroll-mt-24|antialiased|tabular-nums)$/;

const dead = [];
for (const [cls, files] of used) {
  if (IGNORE.test(cls)) continue;
  const idx = cssPlain.indexOf("." + cls);
  let found = false;
  if (idx !== -1) {
    // Make sure it's a whole selector, not a prefix of a longer class.
    const after = cssPlain[idx + cls.length + 1];
    found = !/[\w-]/.test(after ?? "");
  }
  if (!found) dead.push({ cls, files: [...files] });
}

// Heuristic: only report things that look like real utilities.
const LOOKS_UTILITY =
  /^(hover:|focus:|active:|sm:|md:|lg:|xl:|first:|disabled:|placeholder:)*(h|w|min-h|max-w|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|text|bg|border|rounded|shadow|top|bottom|left|right|inset|z|leading|tracking|flex|grid|col|row)-/;

const real = dead.filter((d) => LOOKS_UTILITY.test(d.cls));

console.log(`Scanned ${sources.length} source files against ${cssFiles.length} CSS bundle(s).`);
if (real.length) process.exitCode = 1;
console.log(`\n${real.length} utility class(es) produced NO CSS:\n`);
for (const d of real.sort((a, b) => a.cls.localeCompare(b.cls))) {
  console.log(`  ${d.cls.padEnd(28)} ${d.files.join(", ")}`);
}
