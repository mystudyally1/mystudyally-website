import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DarkCtaSection } from "@/components/marketing/DarkCtaSection";
import { formatDate, getAllPosts, getAllTags } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { pageOpenGraph } from "@/lib/metadata";

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
  const description = `Articles tagged ${label} from the MyStudyAlly blog.`;
  return {
    title: `${label} posts`,
    description,
    alternates: { canonical: `${SITE_URL}/blog/tag/${tag}/` },
    openGraph: pageOpenGraph({
      title: `${label} posts`,
      description,
      path: `/blog/tag/${tag}/`,
    }),
  };
}

export default async function TagPage(props: PageProps<"/blog/tag/[tag]">) {
  const { tag } = await props.params;
  const label = resolveTag(tag);
  if (!label) notFound();

  const posts = getAllPosts().filter((p) => p.tags.includes(label));

  return (
    <>
      {/* Hero — same shape as /blog/, so a tag page reads as part of the blog
          rather than a differently-designed corner of the site. */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[8px] pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <Link
              href="/blog/"
              className="text-12 font-bold tracking-[0.1em] text-muted-3 hover:text-body"
            >
              ← ALL POSTS
            </Link>
            <h1 className="mt-[20px] text-d48 font-extrabold leading-[52px] tracking-[-0.02em] [text-wrap:balance]">
              {label}
            </h1>
            <p className="mt-[16px] text-16 leading-[26px] text-muted">
              {posts.length} {posts.length === 1 ? "post" : "posts"} tagged {label}.
            </p>
          </div>
        </div>
      </section>

      <section className="px-[clamp(20px,5vw,32px)] pb-[64px] pt-[48px]">
        <h2 className="sr-only">Posts tagged {label}</h2>
        <div className="mx-auto grid max-w-container gap-[20px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}/`}
              className="flex min-h-[300px] flex-col overflow-hidden rounded-[22px] border-2 border-border bg-white pb-[22px] text-body shadow-[0_2px_0_#E5E5E5] transition-[box-shadow,transform] duration-[250ms] hover:-translate-y-[3px] hover:text-body hover:shadow-[0_4px_0_#E5E5E5]"
            >
              <div className="relative h-[170px] shrink-0 border-b-2 border-border bg-surface-alt">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col px-[26px] pt-[22px]">
                <span className="text-11 font-bold tracking-[0.14em] text-muted">{p.tag}</span>
                <h3 className="mt-[14px] line-clamp-2 text-19 font-extrabold leading-[24px] tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="mb-[20px] mt-[10px] line-clamp-3 text-13_5 leading-[1.65] text-muted">
                  {p.description}
                </p>
                <div className="mt-auto flex flex-col gap-[3px] border-t border-border pt-[14px]">
                  <span className="text-12_5 font-bold text-body">Written by {p.author}</span>
                  <span className="text-12 font-semibold text-muted-3">
                    {formatDate(p.date)} · {p.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <DarkCtaSection
        headline="Ready to get your child the right support?"
        sub={"Tell us what they need — we'll take it from there."}
      />
    </>
  );
}
