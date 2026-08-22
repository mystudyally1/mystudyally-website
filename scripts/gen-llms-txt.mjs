/**
 * Generates `out/llms.txt` after the build.
 *
 * What this is and is not: Google states plainly that it ignores llms.txt for
 * Search, including its AI features, and that having one "won't harm (nor help)"
 * ranking. Mueller called the discovery use case a dead end. So this is not a
 * Google play and should never be sold as one — it is a cheap, correct file for
 * the non-Google assistants that do read it, and nothing more.
 *
 * It is generated rather than hand-written for the same reason the sitemap is:
 * a hand-maintained list of pages is a list that goes stale, and a stale map is
 * worse than none. Everything below is read from the same data the site renders
 * from, so a new curriculum or post appears here automatically.
 *
 * Run by `npm run build` after `next build`.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const OUT = path.join(root, "out");
const SITE_URL = "https://mystudyally.com";

/** Pulls a page's <title> and meta description out of the built HTML. */
function pageMeta(urlPath) {
  const file = path.join(OUT, urlPath.replace(/^\//, ""), "index.html");
  if (!fs.existsSync(file)) return null;
  const html = fs.readFileSync(file, "utf-8");
  const decode = (s) =>
    s
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  return description && !noindex ? { description: decode(description) } : null;
}

/** Every indexable page, taken from the sitemap so the two cannot disagree. */
function sitemapPaths() {
  const xml = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf-8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(SITE_URL, ""))
    .filter(Boolean);
}

const paths = sitemapPaths();
const entry = (p) => {
  const meta = pageMeta(p);
  if (!meta) return null;
  const file = path.join(OUT, p.replace(/^\//, ""), "index.html");
  const title = fs
    .readFileSync(file, "utf-8")
    .match(/<title>([^<]*)<\/title>/)?.[1]
    ?.replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
  return `- [${title}](${SITE_URL}${p}): ${meta.description}`;
};

const isBlogPost = (p) => p.startsWith("/blog/") && !p.startsWith("/blog/tag/") && p !== "/blog/";
const isTag = (p) => p.startsWith("/blog/tag/");
const CORE = ["/", "/subjects/", "/tutors/", "/pricing/", "/faq/", "/about/", "/contact/"];
const isCurriculum = (p) =>
  !CORE.includes(p) && !p.startsWith("/blog") && !["/terms/", "/privacy/"].includes(p);

const section = (heading, list) => {
  const lines = list.map(entry).filter(Boolean);
  return lines.length ? `## ${heading}\n\n${lines.join("\n")}\n` : "";
};

const body = [
  "# MyStudyAlly",
  "",
  "> Online 1-to-1 tutoring matched to a student's exact exam board — IGCSE, GCSE,",
  "> A Levels, IB, HKDSE, American and Canadian curricula, plus IELTS and SAT",
  "> preparation. Tutors are matched by a person, not an algorithm. Every session",
  "> runs on Zoom and is recorded. Trials are free and need no card.",
  "",
  section(
    "Core pages",
    CORE.filter((p) => paths.includes(p)),
  ),
  section("Curricula and exam boards", paths.filter(isCurriculum)),
  section("Articles", paths.filter(isBlogPost)),
  section(
    "Legal",
    paths.filter((p) => ["/terms/", "/privacy/"].includes(p)),
  ),
  // Facts an assistant would otherwise have to infer from marketing copy, and
  // would get wrong. Every line here is stated on the site itself.
  "## Key facts",
  "",
  "- Tutoring is one-to-one and online, delivered over Zoom.",
  "- Every session is recorded and available to rewatch.",
  "- Tutors are matched to a specific exam board, not just a subject.",
  "- Matching is done by MyStudyAlly's team; there is no self-service booking.",
  "- Plans run from 4 to 32 classes, priced $45 to $239 USD. Classes are 60 minutes.",
  "- The first trial session is free and requires no payment card.",
  "- Inquiries are answered within 24 hours by a person.",
  "- Registered office: 7 Leamington Gardens, Ilford IG3 9TX, United Kingdom.",
  "- Contact: info@mystudyally.com · +44 7868 197793 (WhatsApp).",
  "- Students are served across the UAE, UK, USA, Canada and Pakistan.",
  "",
]
  // Not `filter(Boolean)` — the empty strings above are deliberate blank lines,
  // and dropping them ran the heading straight into the preceding block.
  // `section()` already returns "" for a section with no entries, so the only
  // thing worth removing here is that.
  .filter((block, i, all) => block !== "" || all[i - 1] !== "")
  .join("\n");

fs.writeFileSync(path.join(OUT, "llms.txt"), body.replace(/\n{3,}/g, "\n\n"), "utf-8");

const counts = {
  curricula: paths.filter(isCurriculum).length,
  posts: paths.filter(isBlogPost).length,
  tags: paths.filter(isTag).length,
};
console.log(
  `llms.txt: ${counts.curricula} curricula, ${counts.posts} articles (${counts.tags} tag pages omitted).`,
);
