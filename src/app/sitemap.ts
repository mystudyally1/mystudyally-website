import type { MetadataRoute } from "next";
import { CURRICULA } from "@/data/curricula";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { NOINDEX_CURRICULA, SITE_URL } from "@/lib/constants";

// Required for output: "export" — these are generated at build time.
export const dynamic = "force-static";

const toTagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, "-");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "subjects/", priority: 0.8 },
    { path: "tutors/", priority: 0.8 },
    { path: "pricing/", priority: 0.9 },
    { path: "about/", priority: 0.6 },
    { path: "contact/", priority: 0.9 },
    { path: "faq/", priority: 0.7 },
    { path: "blog/", priority: 0.6 },
    { path: "terms/", priority: 0.3 },
    { path: "privacy/", priority: 0.3 },
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}/${r.path}`,
      lastModified: now,
      priority: r.priority,
    })),
    // /thank-you/ is deliberately excluded — it is noindex.
    ...CURRICULA.filter((c) => !NOINDEX_CURRICULA.includes(c.slug)).map((c) => ({
      url: `${SITE_URL}/${c.slug}/`,
      lastModified: now,
      priority: 0.8,
    })),
    ...getAllPosts().map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      lastModified: new Date(p.date + "T00:00:00Z"),
      priority: 0.5,
    })),
    ...getAllTags().map((t) => ({
      url: `${SITE_URL}/blog/tag/${toTagSlug(t)}/`,
      lastModified: now,
      priority: 0.3,
    })),
  ];
}
