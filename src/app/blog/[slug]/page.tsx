import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/marketing/CtaBand";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import { SITE_NAME, SITE_URL, SLA_RESPONSE_TIME } from "@/lib/constants";

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
    },
  };
}

const components = {
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-10 text-d-md text-ink" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 text-xl font-bold text-ink" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p className="mt-4 text-lg leading-relaxed text-muted" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-lg leading-relaxed text-muted" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-lg leading-relaxed text-muted" {...props} />
  ),
  strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-bold text-ink" {...props} />
  ),
};

export default async function BlogPost(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author ?? SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="pb-6 pt-14">
        <Container className="max-w-2xl">
          <Link href="/blog/" className="text-sm font-bold text-muted hover:text-ink">
            ← All posts
          </Link>
          <time dateTime={post.date} className="mt-6 block text-xs font-bold tracking-wide text-muted-3">
            {formatDate(post.date).toUpperCase()}
          </time>
          <h1 className="mt-3 text-d-3xl text-ink">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog/tag/${encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"))}/`}
                  className="rounded-pill bg-surface-alt px-3 py-1 text-xs font-semibold text-muted hover:text-ink"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section className="py-4">
        <Container className="max-w-2xl">
          <article className="border-t border-border pt-8">
            <MDXRemote source={post.content} components={components} />
          </article>
        </Container>
      </Section>

      <Section>
        <Container>
          <CtaBand
            headline="Ready to get started?"
            sub={`Submit an inquiry and we'll match you with a tutor ${SLA_RESPONSE_TIME}.`}
          />
        </Container>
      </Section>
    </>
  );
}
