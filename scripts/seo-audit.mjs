/**
 * Static-output SEO audit.
 *
 * Runs over `out/` after a build and fails the run on anything that would cost
 * indexing or a rich result. The point is that these regressions are silent — a
 * page that loses its canonical, or ships JSON-LD with a dangling @id, looks
 * completely fine in a browser and only surfaces weeks later in Search Console.
 *
 *   node scripts/seo-audit.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "out");
const SITE_URL = "https://mystudyally.com";

/**
 * Title truncation is measured in pixels, not characters.
 *
 * Google cuts a desktop result title at roughly 600px of Arial 20px. A
 * character count is only a proxy for that, and a poor one: "Illinois' little
 * list" and "WWW MMM QQQ AAA BBB" are the same length and nowhere near the same
 * width. Counting characters flagged a 61-character headline here that actually
 * renders at 597px and fits — and would have passed a 60-character title made
 * of capitals that overflows badly.
 *
 * Descriptions stay on a character count: their container is wide enough that
 * the variance stops mattering, and 155-165 is the well-established range.
 */
const TITLE_MAX_PX = 600;
const DESC_MIN = 70;
const DESC_MAX = 165;

/** Arial advance widths, per 1000 units of em. */
const ARIAL_WIDTHS = (() => {
  const w = {
    " ": 278, "!": 278, '"': 355, "#": 556, $: 556, "%": 889, "&": 667, "'": 191,
    "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333, ".": 278, "/": 278,
    ":": 278, ";": 278, "<": 584, "=": 584, ">": 584, "?": 556, "@": 1015,
    "[": 278, "\\": 278, "]": 278, "^": 469, _: 556, "`": 333,
    "{": 334, "|": 260, "}": 334, "~": 584,
    // Punctuation the copy actually uses: curly quotes, dashes, the middot.
    "‘": 191, "’": 191, "“": 333, "”": 333,
    "–": 556, "—": 1000, "·": 278, "…": 1000,
  };
  for (const c of "0123456789") w[c] = 556;
  const upper = {
    A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278,
    J: 500, K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722,
    S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  };
  const lower = {
    a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222,
    j: 222, k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333,
    s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  };
  return Object.assign(w, upper, lower);
})();

/** Rendered width of `text` in Arial at `size` px. Unknown glyphs assume 556. */
const textWidthPx = (text, size = 20) =>
  [...text].reduce((total, ch) => total + (ARIAL_WIDTHS[ch] ?? 556) * (size / 1000), 0);

const errors = [];
const warnings = [];

const fail = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

/** Every index.html under out/, as site-relative URL paths. */
function htmlPages(dir = OUT, base = "/") {
  const pages = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === "_next") continue;
      pages.push(...htmlPages(path.join(dir, entry.name), `${base}${entry.name}/`));
    } else if (entry.name === "index.html") {
      pages.push({ url: base, file: path.join(dir, entry.name) });
    }
  }
  return pages;
}

/**
 * Length checks run on rendered text, so entities have to come off first —
 * an apostrophe ships as `&#x27;` and counts as six characters otherwise,
 * which flagged titles that are actually well inside the limit.
 */
const decode = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const attr = (tag, name) => {
  const raw = tag.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1];
  return raw === undefined ? null : decode(raw);
};

const metaContent = (html, key, value) => {
  const tag = html.match(new RegExp(`<meta[^>]*${key}="${value}"[^>]*>`, "i"))?.[0];
  return tag ? attr(tag, "content") : null;
};

/**
 * Collects every @id a page defines and every @id it references.
 *
 * A bare `{ "@id": "..." }` with no other keys is a reference; anything with
 * properties alongside is a definition. A reference no page defines makes the
 * graph unresolvable to a consumer that follows it — which is the whole reason
 * for using @id cross-references rather than repeating the node.
 */
function walkIds(node, defined, referenced) {
  if (Array.isArray(node)) {
    for (const item of node) walkIds(item, defined, referenced);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (node["@id"]) {
    if (Object.keys(node).length === 1) referenced.add(node["@id"]);
    else defined.add(node["@id"]);
  }
  for (const [k, v] of Object.entries(node)) {
    if (k !== "@id") walkIds(v, defined, referenced);
  }
}

const pages = htmlPages();
if (pages.length === 0) {
  console.error("No pages found in out/ — run `npm run build` first.");
  process.exit(1);
}

// The organisation and website nodes are defined in the root layout, so every
// page carries them; a page may reference an @id another page defines.
const globalIds = new Set();

const pageData = pages.map((p) => {
  const html = fs.readFileSync(p.file, "utf-8");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const graphs = [];
  for (const [, raw] of blocks) {
    try {
      graphs.push(JSON.parse(raw));
    } catch (e) {
      fail(p.url, `JSON-LD does not parse: ${e.message}`);
    }
  }
  const defined = new Set();
  const referenced = new Set();
  walkIds(graphs, defined, referenced);
  for (const id of defined) globalIds.add(id);
  return { ...p, html, graphs, defined, referenced };
});

for (const page of pageData) {
  const { url, html, graphs, defined, referenced } = page;

  // -------------------------------------------------------------- title ----
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail(url, "no <title>");
  else {
    const text = decode(title);
    const width = Math.round(textWidthPx(text));
    if (width > TITLE_MAX_PX) {
      warn(url, `title renders ~${width}px wide (>${TITLE_MAX_PX}px) — Google will truncate it`);
    }
  }

  // -------------------------------------------------------- description ----
  const desc = metaContent(html, "name", "description");
  if (!desc) fail(url, "no meta description");
  else if (desc.length < DESC_MIN) warn(url, `description is ${desc.length} chars (<${DESC_MIN})`);
  else if (desc.length > DESC_MAX) warn(url, `description is ${desc.length} chars (>${DESC_MAX})`);

  // -------------------------------------------------- robots / canonical ---
  const robots = metaContent(html, "name", "robots") ?? "";
  const noindex = /noindex/i.test(robots);

  const canonicalTag = html.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0];
  const canonical = canonicalTag ? attr(canonicalTag, "href") : null;
  if (!noindex) {
    if (!canonical) fail(url, "no canonical link");
    else if (canonical !== `${SITE_URL}${url}`) {
      fail(url, `canonical is ${canonical}, expected ${SITE_URL}${url}`);
    }
  }

  // ---------------------------------------------------------- open graph ---
  for (const prop of ["og:title", "og:description", "og:image", "og:url", "og:type"]) {
    if (!metaContent(html, "property", prop)) fail(url, `missing ${prop}`);
  }
  const ogUrl = metaContent(html, "property", "og:url");
  if (ogUrl && canonical && ogUrl !== canonical) {
    fail(url, `og:url (${ogUrl}) disagrees with canonical (${canonical})`);
  }
  if (!metaContent(html, "name", "twitter:card")) fail(url, "missing twitter:card");

  // `twitter` is a separate top-level field from `openGraph` in Next's metadata
  // and is replaced by the same shallow merge. Because no page declared one,
  // every page shipped the root layout's card — /pricing/, /igcse/ and every
  // blog post all announced themselves to X and Slack as the homepage. The og:
  // tags were right the whole time, which is why nothing caught it.
  for (const [twProp, ogProp] of [
    ["twitter:title", "og:title"],
    ["twitter:description", "og:description"],
    ["twitter:image", "og:image"],
  ]) {
    const tw = metaContent(html, "name", twProp);
    const og = metaContent(html, "property", ogProp);
    if (tw && og && tw !== og) {
      fail(url, `${twProp} ("${tw}") disagrees with ${ogProp} ("${og}")`);
    }
  }

  // ------------------------------------------------------------ headings ---
  const h1s = [...html.matchAll(/<h1[^>]*>/g)];
  if (h1s.length === 0) fail(url, "no <h1>");
  else if (h1s.length > 1) fail(url, `${h1s.length} <h1> elements (expected 1)`);

  // -------------------------------------------------------------- images ---
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(tag)) fail(url, `<img> with no alt attribute: ${tag.slice(0, 90)}`);
  }

  // ---------------------------------------------------------------- lang ---
  if (!/<html[^>]*\blang="/.test(html)) fail(url, "<html> has no lang attribute");

  // ------------------------------------------------- double-escaped text ---
  // An HTML entity stored as literal text in a data file gets escaped a second
  // time on render, so `&amp;` in the source ships as `&amp;amp;` and a reader
  // sees the characters "&amp;". It reached /sat/'s hero copy, its meta
  // description and its Course schema before anything caught it.
  const doubleEscaped = new Set(
    [...html.matchAll(/&amp;(?:amp|quot|apos|lt|gt|nbsp|#\d+|#x[0-9a-f]+);/gi)].map((m) => m[0]),
  );
  for (const entity of doubleEscaped) {
    fail(url, `double-escaped entity renders as visible text: ${entity}`);
  }

  // ---------------------------------------------------------- structured ---
  if (noindex) continue;

  if (graphs.length === 0) fail(url, "no JSON-LD structured data");
  for (const id of referenced) {
    if (!defined.has(id) && !globalIds.has(id)) {
      fail(url, `JSON-LD references undefined @id: ${id}`);
    }
  }
  for (const [i, graph] of graphs.entries()) {
    for (const [j, node] of (Array.isArray(graph) ? graph : [graph]).entries()) {
      if (!node["@type"]) fail(url, `JSON-LD graph[${i}][${j}] has no @type`);
      if (!node["@context"]) fail(url, `JSON-LD graph[${i}][${j}] has no @context`);

      // ------------------------------------------------ author E-E-A-T ------
      // An article whose author is a bare name is an anonymous article as far
      // as an evaluator is concerned: nothing links the byline to a person who
      // can be checked. Warning, not failure — the fix is a real author profile,
      // which is content work, and inventing credentials to silence a linter is
      // precisely the manufactured-expertise signal the guidelines penalise.
      if (node["@type"] === "BlogPosting" || node["@type"] === "Article") {
        const author = node.author;
        // A reference to a defined entity (the organisation) is identity: that
        // node carries an address, a phone number and a legal name. Only a
        // free-floating personal name with nothing attached is anonymous.
        const isEntityReference = author && Object.keys(author).length === 1 && author["@id"];
        const identified =
          isEntityReference ||
          (author && (author.url || author.jobTitle || author.description || author.sameAs));
        if (!author) {
          fail(url, "article has no author");
        } else if (!identified) {
          warn(
            url,
            `author "${author.name}" has name only — no url, jobTitle, description or sameAs ` +
              "to establish who wrote it",
          );
        }
      }
    }
  }
}

// ------------------------------------------------------ sitemap / robots ----
const sitemapPath = path.join(OUT, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  fail("sitemap.xml", "not generated");
} else {
  const xml = fs.readFileSync(sitemapPath, "utf-8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const indexable = pageData
    .filter((p) => !/noindex/i.test(metaContent(p.html, "name", "robots") ?? ""))
    .map((p) => `${SITE_URL}${p.url}`);

  for (const url of indexable) {
    if (!locs.includes(url)) fail("sitemap.xml", `indexable page missing: ${url}`);
  }
  for (const loc of locs) {
    if (!indexable.includes(loc)) {
      fail("sitemap.xml", `lists a non-indexable or missing URL: ${loc}`);
    }
  }
  // Identical lastmod across the whole file is the pattern search engines learn
  // to ignore. Catch it before it ships again.
  const mods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  if (mods.length > 3 && new Set(mods).size === 1) {
    fail("sitemap.xml", "every entry shares one lastmod — the field carries no information");
  }
}

if (!fs.existsSync(path.join(OUT, "site.webmanifest"))) fail("site.webmanifest", "not generated");

// ---------------------------------------------- robots.txt / AI crawlers ----
const robotsPath = path.join(OUT, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  fail("robots.txt", "not generated");
} else {
  const txt = fs.readFileSync(robotsPath, "utf-8");

  // Parsed into groups because robots.txt is not inherited: a consumer obeys
  // the single most specific group matching its token and ignores every other,
  // so a rule in `*` does nothing for a named agent. This is the failure mode
  // that quietly exposes a page you meant to keep out of the index.
  const groups = [];
  let current = null;
  // Split on "\n" alone; any trailing "\r" is removed by the trim() calls below.
  for (const line of txt.split("\n")) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      if (!current || current.rules.length > 0) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value);
    } else if (current && (key === "allow" || key === "disallow")) {
      current.rules.push({ type: key, value });
    }
  }

  const AI_SEARCH_CRAWLERS = [
    "GPTBot",
    "OAI-SearchBot",
    "ClaudeBot",
    "PerplexityBot",
    "Google-Extended",
  ];
  const named = new Set(groups.flatMap((g) => g.agents));
  for (const bot of AI_SEARCH_CRAWLERS) {
    if (!named.has(bot)) {
      warn("robots.txt", `${bot} has no explicit group — it inherits "*" (currently allowed)`);
    }
  }

  // Whatever `*` keeps out, every named group must keep out too.
  const starGroup = groups.find((g) => g.agents.includes("*"));
  const starDisallows = (starGroup?.rules ?? [])
    .filter((r) => r.type === "disallow" && r.value)
    .map((r) => r.value);
  for (const group of groups) {
    const isImageBot = group.agents.some((a) => /image/i.test(a));
    if (group.agents.includes("*") || isImageBot) continue;
    const has = new Set(
      group.rules.filter((r) => r.type === "disallow").map((r) => r.value),
    );
    for (const rule of starDisallows) {
      if (!has.has(rule)) {
        fail(
          "robots.txt",
          `group "${group.agents.join(", ")}" does not repeat Disallow: ${rule} from "*" — ` +
            "robots.txt groups are not inherited, so this agent may crawl it",
        );
      }
    }
  }

  if (!/^\s*Sitemap:/im.test(txt)) fail("robots.txt", "no Sitemap: directive");

  /**
   * robots.txt path matching: `*` is any run of characters, a trailing `$`
   * anchors the end, and the pattern is a prefix match otherwise.
   */
  const robotsMatches = (pattern, urlPath) => {
    const anchored = pattern.endsWith("$");
    const body = anchored ? pattern.slice(0, -1) : pattern;
    const re = new RegExp(
      "^" + body.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") +
        (anchored ? "$" : ""),
    );
    return re.test(urlPath);
  };

  // Files written specifically so a crawler can read them must not then be
  // disallowed to it. A blanket "/*.txt$" rule did exactly that to /llms.txt —
  // the file exists only for the AI crawlers that were being told to skip it.
  const MUST_STAY_REACHABLE = ["/llms.txt", "/sitemap.xml", "/site.webmanifest"];
  for (const group of groups) {
    for (const rule of group.rules) {
      if (rule.type !== "disallow" || !rule.value) continue;
      for (const target of MUST_STAY_REACHABLE) {
        if (robotsMatches(rule.value, target)) {
          fail(
            "robots.txt",
            `group "${group.agents.join(", ")}" disallows ${target} via "${rule.value}" — ` +
              "that file exists to be fetched by crawlers",
          );
        }
      }
    }
  }
}

// ------------------------------------------------------------- llms.txt -----
// Optional and explicitly ignored by Google Search, so its absence is not a
// failure. When present it must not go stale — a link list pointing at pages
// that no longer exist is worse than no file.
const llmsPath = path.join(OUT, "llms.txt");
if (!fs.existsSync(llmsPath)) {
  warn("llms.txt", "not present (optional; Google Search ignores it)");
} else {
  const llms = fs.readFileSync(llmsPath, "utf-8");
  const linked = [...llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
  const known = new Set(pageData.map((p) => `${SITE_URL}${p.url}`));
  for (const link of linked) {
    if (!known.has(link)) fail("llms.txt", `links to a page that does not exist: ${link}`);
  }
  if (linked.length === 0) fail("llms.txt", "contains no page links");
}

// ------------------------------------------------- IndexNow key integrity ---
// The key file proves ownership by being fetchable and containing exactly the
// key. A mismatch makes every submission fail silently at the endpoint.
const keyFiles = fs.readdirSync(OUT).filter((f) => /^[0-9a-f]{8,128}\.txt$/.test(f));
for (const file of keyFiles) {
  const contents = fs.readFileSync(path.join(OUT, file), "utf-8").trim();
  const expected = file.replace(/\.txt$/, "");
  if (contents !== expected) {
    fail(file, `IndexNow key file must contain exactly "${expected}"`);
  }
}

// ------------------------------------------------------------------ report --
console.log(`Audited ${pages.length} pages.`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.error(`  FAIL  ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} SEO error(s).`);
  process.exit(1);
}
console.log(`\nNo SEO errors${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
