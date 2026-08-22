import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { CURRICULA } from "@/data/curricula";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { NOINDEX_CURRICULA, SITE_URL } from "@/lib/constants";

// Required for output: "export" — these are generated at build time.
export const dynamic = "force-static";

const toTagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, "-");

/**
 * Last-modified date for a route, taken from the mtime of the file that renders
 * it.
 *
 * Every entry previously reported `new Date()`, so a deploy that touched one
 * blog post told Google all forty URLs had changed. Search engines detect that
 * pattern and stop trusting `lastmod` for the whole site, which costs the one
 * thing the field is for: getting a genuinely changed page recrawled quickly.
 *
 * Falls back to the build date only when the source file can't be found.
 */
const BUILD_DATE = new Date();
function sourceModified(...candidates: string[]): Date {
  for (const rel of candidates) {
    const file = path.join(process.cwd(), rel);
    try {
      return fs.statSync(file).mtime;
    } catch {
      // Try the next candidate.
    }
  }
  return BUILD_DATE;
}

interface StaticRoute {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  /** Repo-relative sources whose mtime represents this page's content. */
  sources: string[];
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: "", priority: 1, changeFrequency: "weekly", sources: ["src/app/page.tsx"] },
  {
    path: "pricing/",
    priority: 0.9,
    changeFrequency: "monthly",
    sources: ["src/data/pricing.ts", "src/app/pricing/page.tsx"],
  },
  {
    path: "contact/",
    priority: 0.9,
    changeFrequency: "monthly",
    sources: ["src/app/contact/page.tsx"],
  },
  {
    path: "subjects/",
    priority: 0.8,
    changeFrequency: "monthly",
    sources: ["src/data/subject-groups.ts", "src/app/subjects/page.tsx"],
  },
  {
    path: "tutors/",
    priority: 0.8,
    changeFrequency: "weekly",
    sources: ["src/data/tutors.ts", "src/app/tutors/page.tsx"],
  },
  {
    path: "faq/",
    priority: 0.7,
    changeFrequency: "monthly",
    sources: ["src/data/faqs.ts", "src/app/faq/page.tsx"],
  },
  {
    path: "about/",
    priority: 0.6,
    changeFrequency: "yearly",
    sources: ["src/data/about.ts", "src/app/about/page.tsx"],
  },
  { path: "blog/", priority: 0.6, changeFrequency: "weekly", sources: ["content/blog"] },
  { path: "terms/", priority: 0.3, changeFrequency: "yearly", sources: ["src/app/terms/page.tsx"] },
  {
    path: "privacy/",
    priority: 0.3,
    changeFrequency: "yearly",
    sources: ["src/app/privacy/page.tsx"],
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const curriculumSource = sourceModified(
    "src/data/curriculum-pages.ts",
    "src/app/[curriculum]/page.tsx",
  );

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${SITE_URL}/${r.path}`,
      lastModified: sourceModified(...r.sources),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    // /thank-you/ is deliberately excluded — it is noindex.
    ...CURRICULA.filter((c) => !NOINDEX_CURRICULA.includes(c.slug)).map((c) => ({
      url: `${SITE_URL}/${c.slug}/`,
      lastModified: curriculumSource,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getAllPosts().map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      // The post's own `updated` (or `date`) rather than the file mtime: a
      // reformat or a typo fix is not a content change worth a recrawl, and
      // the frontmatter is where the author says what is.
      lastModified: new Date(p.updated + "T00:00:00Z"),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...getAllTags().map((t) => {
      const tagged = getAllPosts().filter((p) => p.tags.includes(t));
      const newest = tagged.reduce((acc, p) => (p.updated > acc ? p.updated : acc), "0000-00-00");
      return {
        url: `${SITE_URL}/blog/tag/${toTagSlug(t)}/`,
        // A tag page changes when a post joins it — the newest post's date is
        // exactly that moment.
        lastModified: new Date(newest + "T00:00:00Z"),
        changeFrequency: "monthly" as const,
        priority: 0.3,
      };
    }),
  ];
}
