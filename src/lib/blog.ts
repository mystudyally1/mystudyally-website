import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  /**
   * Optional `updated:` frontmatter, YYYY-MM-DD. Feeds `dateModified` in the
   * article schema — an evergreen post that has been revised should say so,
   * and without this field every post's modified date is frozen at publication.
   * Falls back to `date` when absent.
   */
  updated: string;
  /** Uppercase chip shown on the card, e.g. "SAT", "FOR PARENTS". */
  tag: string;
  tags: string[];
  author: string;
  readTime: string;
  image: string;
  /** Curriculum slug for the "this article covers X" destination block. */
  destination?: string;
  destinationLabel?: string;
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

  const str = (key: string, required: boolean): string => {
    const v = data[key];
    if (v === undefined || v === null || v === "") {
      if (required) fail(`\`${key}\` is required`);
      return "";
    }
    if (typeof v !== "string") fail(`\`${key}\` must be a string`);
    return v as string;
  };

  const title = str("title", true);
  const description = str("description", true);
  const tag = str("tag", true);
  const author = str("author", true);
  const readTime = str("readTime", true);
  const image = str("image", true);
  const destination = str("destination", false) || undefined;
  const destinationLabel = str("destinationLabel", false) || undefined;

  const toIso = (value: unknown, key: string): string => {
    const out =
      value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(out)) fail(`\`${key}\` must be YYYY-MM-DD`);
    return out;
  };

  const date = data.date;
  if (!(date instanceof Date) && typeof date !== "string") fail("`date` is required (YYYY-MM-DD)");
  const iso = toIso(date, "date");

  const updatedRaw = data.updated;
  const updated =
    updatedRaw === undefined || updatedRaw === null || updatedRaw === ""
      ? iso
      : toIso(updatedRaw, "updated");
  if (updated < iso) fail("`updated` cannot be earlier than `date`");

  const tags = data.tags ?? [];
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    fail("`tags` must be a list of strings");
  }

  const imagePath = path.join(process.cwd(), "public", image.replace(/^\//, ""));
  if (!fs.existsSync(imagePath)) fail(`\`image\` not found at public${image}`);

  return {
    title,
    description,
    date: iso,
    updated,
    tag,
    tags: tags as string[],
    author,
    readTime,
    image,
    destination,
    destinationLabel,
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

export function getRelatedPosts(slug: string, limit = 2): Post[] {
  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return all.slice(0, limit);
  // The next posts in reverse-chronological order, wrapping around.
  return [...all.slice(index + 1), ...all.slice(0, index)].slice(0, limit);
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
