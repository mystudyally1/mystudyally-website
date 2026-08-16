import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { formatDate, getAllPosts, getAllTags } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

export const dynamicParams = false;

const toSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, "-");

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: toSlug(t) }));
}

function resolveTag(slug: string): string | undefined {
  return getAllTags().find((t) => toSlug(t) === slug);
}

export async function generateMetadata(props: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag } = await props.params;
  const label = resolveTag(tag);
  if (!label) return {};
  return {
    title: `${label} posts`,
    description: `Articles tagged ${label} from the MyStudyAlly blog.`,
    alternates: { canonical: `${SITE_URL}/blog/tag/${tag}/` },
  };
}

export default async function TagPage(props: PageProps<"/blog/tag/[tag]">) {
  const { tag } = await props.params;
  const label = resolveTag(tag);
  if (!label) notFound();

  const posts = getAllPosts().filter((p) => p.tags.includes(label));

  return (
    <Section className="py-14">
      <Container>
        <Link href="/blog/" className="text-sm font-bold text-muted hover:text-ink">
          ← All posts
        </Link>
        <h1 className="mt-6 text-d-3xl text-ink">{label}</h1>
        <p className="mt-3 text-lg text-muted">
          {posts.length} {posts.length === 1 ? "post" : "posts"} tagged {label}.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col rounded-2xl border-2 border-border bg-white p-6 shadow-[0_2px_0_#E5E5E5] transition hover:-translate-y-1 hover:shadow-[0_4px_0_#E5E5E5]"
            >
              <time dateTime={p.date} className="text-xs font-bold tracking-wide text-muted-3">
                {formatDate(p.date).toUpperCase()}
              </time>
              <h2 className="mt-3 text-xl font-extrabold leading-tight text-ink">
                <Link href={`/blog/${p.slug}/`} className="text-ink hover:text-link">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
