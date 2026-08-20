import type { Metadata } from "next";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/constants";

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
}: {
  title: string;
  description: string;
  /** Site-relative, with the leading and trailing slash, e.g. "/pricing/". */
  path: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url: `${SITE_URL}${path}`,
    type,
    images: [{ url: image, width: 1200, height: 630, alt: title }],
    ...(type === "article" && publishedTime ? { publishedTime } : {}),
  };
}
