import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { formatDate, getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}/`,
      type: "article",
      publishedTime: post.date,
      images: [{ url: `${SITE_URL}${post.image}` }],
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: `${SITE_URL}${post.image}`,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
  };

  const destinationLabel = post.destinationLabel ?? post.tag;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <span className="text-13 font-bold">Written by {post.author}</span>
            <span className="text-12_5 font-semibold text-muted-3">
              {formatDate(post.date)} · {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Post body */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[8px] pt-[40px]">
        <article className="mx-auto max-w-[680px] text-18 leading-[30px] text-body">
          <MDXRemote source={post.content} components={components} />
        </article>
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
