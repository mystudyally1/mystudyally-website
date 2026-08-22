import type { Metadata } from "next";
import Link from "next/link";
import { FaqBrowser } from "@/components/marketing/FaqBrowser";
import { DarkCtaSection } from "@/components/marketing/DarkCtaSection";
import { FAQ_GROUPS } from "@/data/faqs";
import { SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import { abs, breadcrumbJsonLd, homeCrumb, webPageJsonLd } from "@/lib/seo";
import { pageSocial } from "@/lib/metadata";

const TITLE = "Frequently Asked Questions";
const DESCRIPTION =
  "Answers on matching, pricing and payments, scheduling, tutors, and account access — everything families ask before starting with MyStudyAlly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/faq/` },
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/faq/" }),
};

const CRUMBS = [homeCrumb, { name: "FAQ", path: "/faq/" }];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${abs("/faq/")}#faq`,
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
      <JsonLd
        nodes={[
          webPageJsonLd({
            title: TITLE,
            description: DESCRIPTION,
            path: "/faq/",
            crumbs: CRUMBS,
          }),
          breadcrumbJsonLd(CRUMBS),
          faqJsonLd,
        ]}
      />

      {/* Hero */}
      <section className="px-[20px] pb-[16px] pt-[28px] md:px-[clamp(20px,5vw,32px)] md:pb-[8px] md:pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-11 font-extrabold tracking-[0.14em] text-muted md:text-12 md:font-bold">
              FAQ
            </div>
            <h1 className="mt-[12px] text-30 font-extrabold leading-[1.14] tracking-[-0.02em] md:mt-[16px] md:text-d48 md:leading-[52px]">
              Common questions
            </h1>
            <p className="mt-[12px] text-14 leading-[1.65] text-muted [text-wrap:pretty] md:mt-[16px] md:text-16 md:leading-[26px]">
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
      {/* No horizontal padding on mobile: the category chip row scrolls
          edge-to-edge, and its children re-apply the 20px inset. */}
      <section className="px-0 pb-[30px] pt-0 md:px-[clamp(20px,5vw,32px)] md:pb-[40px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            {/* search input lives inside FaqBrowser so it can drive filtering */}
          </div>
          <FaqBrowser />
        </div>
      </section>

      <DarkCtaSection
        headline={"Still have questions?"}
        sub={"Tell us what your child needs — we'll answer the rest personally."}
      />
    </>
  );
}
