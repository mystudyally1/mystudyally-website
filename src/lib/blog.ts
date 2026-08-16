import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  author?: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
}

/**
 * Frontmatter is validated here rather than at render time — a malformed post
 * fails the build instead of shipping a broken page.
 */
function parseFrontmatter(slug: string, data: Record<string, unknown>): PostFrontmatter {
  const fail = (msg: string): never => {
    throw new Error(`Invalid frontmatter in content/blog/${slug}.mdx — ${msg}`);
  };

  const title = data.title;
  const description = data.description;
  const date = data.date;
  const tags = data.tags ?? [];
  const author = data.author;

  if (typeof title !== "string" || !title.trim()) fail("`title` is required");
  if (typeof description !== "string" || !description.trim()) fail("`description` is required");
  if (!(date instanceof Date) && typeof date !== "string") fail("`date` is required (YYYY-MM-DD)");

  const iso = date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) fail("`date` must be YYYY-MM-DD");
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    fail("`tags` must be a list of strings");
  }
  if (author !== undefined && typeof author !== "string") fail("`author` must be a string");

  return {
    title: title as string,
    description: description as string,
    date: iso,
    tags: tags as string[],
    author: author as string | undefined,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return { slug, content, ...parseFrontmatter(slug, data) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  return [...new Set(getAllPosts().flatMap((p) => p.tags))].sort();
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
