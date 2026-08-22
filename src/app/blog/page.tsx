import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DarkCtaSection } from "@/components/marketing/DarkCtaSection";
import { formatDate, getAllPosts } from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION_ID, abs, breadcrumbJsonLd, homeCrumb } from "@/lib/seo";
import { pageSocial } from "@/lib/metadata";

const TITLE = "Study Tips & Exam Guidance";
const DESCRIPTION =
  "Practical advice for parents and students navigating IGCSE, GCSE, A Levels, IB, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/` },
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/blog/" }),
};

const CRUMBS = [homeCrumb, { name: "Blog", path: "/blog/" }];

export default function BlogIndex() {
  const posts = getAllPosts();

  // A Blog node with its posts inline, rather than a generic CollectionPage:
  // it is the type that tells a crawler these URLs are articles by one
  // publisher, which is how the blog gets treated as a body of work instead of
  // ten unrelated pages.
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${abs("/blog/")}#blog`,
    url: abs("/blog/"),
    name: `${SITE_NAME} — ${TITLE}`,
    description: DESCRIPTION,
    inLanguage: "en-GB",
    publisher: { "@id": ORGANIZATION_ID },
    breadcrumb: { "@id": `${abs("/blog/")}#breadcrumb` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      "@id": `${abs(`/blog/${p.slug}/`)}#article`,
      headline: p.title,
      description: p.description,
      url: abs(`/blog/${p.slug}/`),
      datePublished: p.date,
      image: abs(p.image),
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <>
      <JsonLd nodes={[blogJsonLd, breadcrumbJsonLd(CRUMBS)]} />

      {/* Hero */}
      <section className="px-[20px] pb-[6px] pt-[30px] md:px-[clamp(20px,5vw,32px)] md:pb-[8px] md:pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-11 font-bold tracking-[0.14em] text-muted md:text-12">BLOG</div>
            <h1 className="mt-[12px] text-28 font-extrabold leading-[1.16] tracking-[-0.02em] [text-wrap:balance] md:mt-[16px] md:text-d48 md:leading-[52px]">
              Study Tips &amp; Exam Guidance
            </h1>
            <p className="mt-[14px] text-14_5 leading-[1.7] text-muted md:mt-[16px] md:text-16 md:leading-[26px]">
              Practical advice for parents and students navigating IGCSE, GCSE, A Levels, IB, and
              more.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="px-[20px] pb-[34px] pt-[24px] md:px-[clamp(20px,5vw,32px)] md:pb-[64px] md:pt-[48px]">
        <h2 className="sr-only">Latest posts</h2>
        <div className="mx-auto grid max-w-container gap-[16px] md:gap-[20px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          {posts.map((p, i) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}/`}
              className="flex flex-col overflow-hidden rounded-[20px] border-2 border-border bg-white text-body shadow-[0_2px_0_#E5E5E5] hover:shadow-[0_4px_0_#E5E5E5] md:min-h-[300px] md:rounded-[22px] md:pb-[22px] md:transition-[box-shadow,transform] md:duration-[250ms] md:hover:-translate-y-[3px] md:hover:text-body"
            >
              <div className="relative aspect-[16/9] shrink-0 border-b-2 border-border bg-surface-alt md:aspect-auto md:h-[170px]">
                {/* The first card is above the fold and is the largest thing
                    painted there, so it is the LCP element. next/image lazy-
                    loads by default, which means the browser does not even
                    discover it until layout — the one image on the page that
                    must not wait. The rest stay lazy. */}
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
              <div className="flex flex-1 flex-col px-[18px] pb-[18px] pt-[16px] md:px-[26px] md:pb-0 md:pt-[22px]">
                <span className="text-10_5 font-bold tracking-[0.14em] text-muted md:text-11">
                  {p.tag}
                </span>
                <h3 className="mt-[10px] line-clamp-2 text-18 font-extrabold leading-[1.28] tracking-[-0.01em] md:mt-[14px] md:text-19 md:leading-[24px]">
                  {p.title}
                </h3>
                <p className="mb-[16px] mt-[8px] line-clamp-2 text-13_5 leading-[1.6] text-muted md:mb-[20px] md:mt-[10px] md:line-clamp-3 md:leading-[1.65]">
                  {p.description}
                </p>
                <div className="mt-auto flex flex-col gap-[3px] border-t border-border pt-[12px] md:pt-[14px]">
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
