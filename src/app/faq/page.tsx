import type { Metadata } from "next";
import Link from "next/link";
import { FaqBrowser } from "@/components/marketing/FaqBrowser";
import { DarkCtaSection } from "@/components/marketing/DarkCtaSection";
import { FAQ_GROUPS } from "@/data/faqs";
import { SITE_URL } from "@/lib/constants";

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

      <DarkCtaSection
        headline={"Still have questions?"}
        sub={"Tell us what your child needs — we&#39;ll answer the rest personally."}
      />
    </>
  );
}
