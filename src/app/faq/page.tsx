import type { Metadata } from "next";
import Link from "next/link";
import { FaqBrowser } from "@/components/marketing/FaqBrowser";
import { FAQ_GROUPS } from "@/data/faqs";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers on matching, pricing and payments, scheduling, tutors, and account access — everything families ask before starting with MyStudyAlly.",
  alternates: { canonical: `${SITE_URL}/faq/` },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[8px] pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-12 font-bold tracking-[0.14em] text-muted">FAQ</div>
            <h1 className="mt-[16px] text-d48 font-extrabold leading-[52px] tracking-[-0.02em]">
              Common questions
            </h1>
            <p className="mt-[16px] text-16 leading-[26px] text-muted [text-wrap:pretty]">
              Everything you need to know before getting started. Still have a question?{" "}
              <Link href="/contact/" className="underline underline-offset-[3px]">
                Submit an inquiry
              </Link>{" "}
              and we&#39;ll get back to you directly.
            </p>
          </div>
        </div>
      </section>

      {/* Search + rail + questions */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[40px] pt-0">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            {/* search input lives inside FaqBrowser so it can drive filtering */}
          </div>
          <FaqBrowser />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-surface-dark px-[clamp(20px,5vw,32px)] pb-[60px] pt-[56px]">
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-[48px]">
          <div className="max-w-[640px]">
            <h2 className="text-d30 font-extrabold leading-[34px] text-white [text-wrap:balance]">
              Still have questions?
            </h2>
            <p className="mt-[12px] text-15 leading-[1.7] text-muted-4">
              Tell us what your child needs — we&#39;ll answer the rest personally.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-[12px]">
            <Link
              href="/contact/"
              className="inline-block rounded-[16px] bg-primary px-[26px] py-[14px] text-14 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white"
            >
              Submit an inquiry
            </Link>
            <span className="text-12 text-muted-2">
              Or email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-4 underline hover:text-white">
                {CONTACT_EMAIL}
              </a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
