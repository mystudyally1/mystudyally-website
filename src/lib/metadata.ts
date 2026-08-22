import type { Metadata } from "next";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/constants";

interface PageSocialInput {
  title: string;
  description: string;
  /** Site-relative, with the leading and trailing slash, e.g. "/pricing/". */
  path: string;
  type?: "website" | "article";
  image?: string;
  /** article: only. Ignored on a website-type page, where OG has no such field. */
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  section?: string;
}

/**
 * Builds a page's Open Graph block.
 *
 * Next merges `metadata` objects shallowly: a page that declares its own
 * `openGraph` replaces the root one outright rather than filling in the gaps.
 * Every page that set a custom og:title therefore silently lost og:image, and
 * shared as a bare link. Going through here means the image cannot be dropped
 * by accident.
 */
export function pageOpenGraph({
  title,
  description,
  path,
  type = "website",
  image = OG_IMAGE_PATH,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  section,
}: PageSocialInput): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url: `${SITE_URL}${path}`,
    type,
    images: [{ url: image, width: 1200, height: 630, alt: title }],
    // article:published_time / modified_time / author / section / tag are what
    // make a shared post render as an article card with a byline and date
    // rather than a plain link. They are only valid on og:type=article.
    ...(type === "article"
      ? {
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(authors ? { authors } : {}),
          ...(tags ? { tags } : {}),
          ...(section ? { section } : {}),
        }
      : {}),
  };
}

/**
 * Builds a page's Twitter card block.
 *
 * `twitter` is a separate top-level field from `openGraph` and is replaced by
 * the same shallow merge. Because no page ever declared one, every page on the
 * site shipped the root layout's card — so /pricing/, /igcse/ and every blog
 * post all announced themselves to X, Slack and anything else reading
 * `twitter:` tags as "MyStudyAlly — Curriculum-matched tutoring, done properly",
 * with the generic OG image. The og: tags were correct the whole time, which is
 * exactly why it went unnoticed.
 *
 * Exported for completeness, but prefer `pageSocial` — deriving both blocks
 * from one call is what stops them drifting apart again.
 */
export function pageTwitter({
  title,
  description,
  image = OG_IMAGE_PATH,
}: Pick<PageSocialInput, "title" | "description" | "image">): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  };
}

/**
 * The `openGraph` + `twitter` pair for a page, from a single description of it.
 *
 * Spread into a page's `metadata`:
 *
 *   export const metadata: Metadata = {
 *     title: TITLE,
 *     description: DESCRIPTION,
 *     alternates: { canonical: `${SITE_URL}/pricing/` },
 *     ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/pricing/" }),
 *   };
 */
export function pageSocial(
  input: PageSocialInput,
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: pageOpenGraph(input),
    twitter: pageTwitter(input),
  };
}
