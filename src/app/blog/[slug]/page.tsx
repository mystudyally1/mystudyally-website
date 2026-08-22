import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { formatDate, getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { getAuthor } from "@/data/authors";
import { SITE_URL } from "@/lib/constants";
import { pageSocial } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  abs,
  breadcrumbJsonLd,
  homeCrumb,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  // The root template appends " — MyStudyAlly" (14 characters). On a post whose
  // own title already fills the ~60 characters a result shows, that suffix is
  // guaranteed to be cut — and it takes the end of the real title with it. Long
  // titles therefore drop the brand and keep their own words.
  const BRAND_SUFFIX_BUDGET = 46;
  const title =
    post.title.length > BRAND_SUFFIX_BUDGET ? { absolute: post.title } : post.title;

  return {
    title,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}/` },
    keywords: post.tags,
    authors: [{ name: post.author }],
    ...pageSocial({
      title: post.title,
      description: post.description,
      path: `/blog/${post.slug}/`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      tags: post.tags,
      section: post.tag,
      image: post.image,
    }),
  };
}

// Body typography from the design's `Post Body` block: 18px / 30px.
const components = {
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-[40px] text-d26 font-extrabold leading-[32px] tracking-[-0.01em]" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-[28px] text-19 font-extrabold" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p className="mt-[22px] first:mt-0" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-[22px] flex list-disc flex-col gap-[10px] pl-[24px]" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-[22px] flex list-decimal flex-col gap-[10px] pl-[24px]" {...props} />
  ),
  strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-extrabold text-body" {...props} />
  ),
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a className="underline underline-offset-[3px]" {...props} />
  ),
};

export default async function BlogPost(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 2);

  // Undefined for organisation-attributed posts, which is every post until a
  // real writer is added to `AUTHORS`. See src/data/authors.ts.
  const authorProfile = getAuthor(post.author);

  const path = `/blog/${post.slug}/`;
  const crumbs = [homeCrumb, { name: "Blog", path: "/blog/" }, { name: post.title, path }];

  // Headlines over 110 characters are dropped from Google's article rich
  // results outright, so the title is trimmed for `headline` only — the
  // rendered <h1> and <title> keep the full wording.
  const headline = post.title.length > 110 ? `${post.title.slice(0, 107).trimEnd()}…` : post.title;

  // Counted off the MDX source. `wordCount` is one of the signals that
  // separates a substantive article from a stub, and hardcoding it would go
  // stale the first time a post is edited.
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${abs(path)}#article`,
    headline,
    alternativeHeadline: post.title,
    description: post.description,
    url: abs(path),
    datePublished: post.date,
    dateModified: post.updated,
    inLanguage: "en-GB",
    wordCount,
    timeRequired: post.readTime,
    articleSection: post.tag,
    keywords: post.tags,
    image: {
      "@type": "ImageObject",
      url: abs(post.image),
      width: 1200,
      height: 675,
    },
    // A registered writer is credited as a Person with the credentials that
    // make the byline checkable. Everything else is the organisation's own work
    // and says so — schema.org allows an Organization as `author`, and pointing
    // at the entity that has an address, a phone number and a legal identity is
    // a stronger claim than a personal name nobody can verify.
    author: authorProfile
      ? {
          "@type": "Person",
          name: authorProfile.name,
          jobTitle: authorProfile.jobTitle,
          description: `${authorProfile.credentials}. ${authorProfile.bio}`,
          worksFor: { "@id": ORGANIZATION_ID },
          ...(authorProfile.sameAs ? { sameAs: authorProfile.sameAs } : {}),
        }
      : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": `${abs("/blog/")}#blog` },
    mainEntityOfPage: { "@id": `${abs(path)}#webpage` },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name: post.title,
    description: post.description,
    inLanguage: "en-GB",
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${abs(path)}#breadcrumb` },
    primaryImageOfPage: { "@type": "ImageObject", url: abs(post.image) },
  };

  const destinationLabel = post.destinationLabel ?? post.tag;

  return (
    <>
      <JsonLd nodes={[webPage, breadcrumbJsonLd(crumbs), articleJsonLd]} />

      {/* Post header */}
      <section className="px-[clamp(20px,5vw,32px)] pb-0 pt-[72px]">
        <div className="mx-auto max-w-[680px]">
          <Link
            href="/blog/"
            className="text-12 font-bold tracking-[0.1em] text-muted-3 hover:text-body"
          >
            ← ALL POSTS
          </Link>
          <div className="mt-[28px] text-12 font-bold tracking-[0.14em] text-muted">{post.tag}</div>
          <h1 className="mt-[14px] text-d42 font-extrabold leading-[48px] tracking-[-0.02em] [text-wrap:balance]">
            {post.title}
          </h1>
          <p className="mt-[16px] text-18 leading-[28px] text-muted">{post.description}</p>
          <div className="mt-[26px] flex items-baseline gap-[14px] border-t border-border pt-[16px]">
            <span className="text-13 font-bold">
              {authorProfile
                ? `Written by ${authorProfile.name}`
                : `Written by ${post.author}`}
              {authorProfile && (
                <span className="font-semibold text-muted-3">
                  {" "}
                  · {authorProfile.credentials}
                </span>
              )}
            </span>
            {/* <time datetime> so the publication date is unambiguous to a
                parser — "15 August 2026" is not a date format anything reads. */}
            <span className="text-12_5 font-semibold text-muted-3">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readTime}
            </span>
            {/* Shown only when the post has actually been revised. The schema
                already carries `dateModified`; a freshness claim a reader
                cannot see on the page is the kind of markup that gets
                discounted, and recency is one of the stronger signals for
                whether an answer engine will cite a page at all. */}
            {post.updated !== post.date && (
              <span className="text-12_5 font-semibold text-muted-3">
                Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Post body */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[8px] pt-[40px]">
        <article className="mx-auto max-w-[680px] text-18 leading-[30px] text-body">
          <MDXRemote source={post.content} components={components} />
        </article>
      </section>

      {/* Author bio. Renders only for a registered writer — the credentials
          block is the visible half of the Person schema above, and a bio card
          for an unverified name would be the manufactured-expertise signal the
          quality guidelines penalise. Organisation-attributed posts carry the
          publisher identity in the byline and the schema instead. */}
      {authorProfile && (
        <section className="px-[clamp(20px,5vw,32px)] pb-0 pt-[40px]">
          <div className="mx-auto max-w-[680px] rounded-[22px] border-2 border-border bg-white px-[28px] py-[24px] shadow-[0_2px_0_#E5E5E5]">
            <div className="text-11 font-bold tracking-[0.14em] text-muted-3">ABOUT THE AUTHOR</div>
            <div className="mt-[10px] text-17 font-extrabold text-body">{authorProfile.name}</div>
            <div className="mt-[2px] text-13 font-bold text-muted">
              {authorProfile.jobTitle} · {authorProfile.credentials}
            </div>
            <p className="mt-[10px] text-14 leading-[1.7] text-muted">{authorProfile.bio}</p>
            {authorProfile.sameAs && authorProfile.sameAs.length > 0 && (
              <div className="mt-[12px] flex flex-wrap gap-[10px]">
                {authorProfile.sameAs.map((href) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className="text-12_5 font-bold text-link underline underline-offset-[3px] hover:text-link-hover"
                  >
                    {new URL(href).hostname.replace(/^www\./, "")}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tag links. The tag pages are generated and sitemapped; without this
          nothing on the site links to them, so they are orphans a visitor can
          only reach from search results. */}
      <section className="px-[clamp(20px,5vw,32px)] pb-0 pt-[36px]">
        <div className="mx-auto flex max-w-[680px] flex-wrap items-center gap-[8px] border-t border-border pt-[20px]">
          <span className="text-11 font-bold tracking-[0.14em] text-muted-3">TAGGED</span>
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/blog/tag/${t.toLowerCase().replace(/\s+/g, "-")}/`}
              className="rounded-pill border border-border bg-white px-[14px] py-[7px] text-12 font-bold text-body hover:border-link-light-3 hover:bg-link-light hover:text-link-hover"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* Destination block */}
      {post.destination && (
        <section className="px-[clamp(20px,5vw,32px)] pb-0 pt-[40px]">
          <div className="mx-auto max-w-[680px]">
            <Link
              href={`/${post.destination}/`}
              className="block rounded-[22px] border-2 border-border px-[28px] py-[24px] text-body shadow-[0_2px_0_#E5E5E5] transition-[box-shadow,transform] duration-[250ms] hover:-translate-y-[2px] hover:text-body hover:shadow-[0_4px_0_#E5E5E5]"
            >
              <div className="text-11 font-bold tracking-[0.14em] text-muted">
                {destinationLabel.toUpperCase()} TUTORING
              </div>
              <div className="mt-[8px] text-17 font-extrabold text-body">
                This article covers {destinationLabel}. See how MyStudyAlly tutors{" "}
                {destinationLabel} →
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <section className="px-[clamp(20px,5vw,32px)] pb-[72px] pt-[56px]">
          <div className="mx-auto max-w-[680px]">
            <div className="mb-[18px] text-12 font-bold tracking-[0.14em] text-muted">RELATED</div>
            <div className="grid gap-[20px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}/`}
                  className="flex min-h-[170px] flex-col rounded-[22px] border-2 border-border bg-white px-[24px] pb-[18px] pt-[22px] text-body shadow-[0_2px_0_#E5E5E5] transition-[box-shadow,transform] duration-[250ms] hover:-translate-y-[3px] hover:text-body hover:shadow-[0_4px_0_#E5E5E5]"
                >
                  <span className="text-11 font-bold tracking-[0.14em] text-muted">{r.tag}</span>
                  <h3 className="mb-[16px] mt-[10px] line-clamp-2 text-16 font-extrabold leading-[21px]">
                    {r.title}
                  </h3>
                  <span className="mt-auto text-12 font-semibold text-muted-3">
                    {formatDate(r.date)} · {r.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
