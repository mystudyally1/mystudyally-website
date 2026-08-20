import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DarkCtaSection } from "@/components/marketing/DarkCtaSection";
import { formatDate, getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical advice for parents and students navigating IGCSE, GCSE, A Levels, IB, and more.",
  alternates: { canonical: `${SITE_URL}/blog/` },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[8px] pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-12 font-bold tracking-[0.14em] text-muted">BLOG</div>
            <h1 className="mt-[16px] text-d48 font-extrabold leading-[52px] tracking-[-0.02em] [text-wrap:balance]">
              Study Tips &amp; Exam Guidance
            </h1>
            <p className="mt-[16px] text-16 leading-[26px] text-muted">
              Practical advice for parents and students navigating IGCSE, GCSE, A Levels, IB, and
              more.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[64px] pt-[48px]">
        <h2 className="sr-only">Latest posts</h2>
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
