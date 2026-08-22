import type { Metadata } from "next";
import Link from "next/link";
import { GetStartedPanel } from "@/components/marketing/GetStartedPanel";
import { FaqList } from "@/components/ui/FaqList";
import { TutorGrid } from "@/components/marketing/TutorGrid";
import { ABOUT_FAQS } from "@/data/about";
import { TUTORS } from "@/data/tutors";
import { SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION_ID, abs, breadcrumbJsonLd, homeCrumb, webPageJsonLd } from "@/lib/seo";
import { pageSocial } from "@/lib/metadata";

const TITLE = "Our Tutors";
const DESCRIPTION =
  "Every MyStudyAlly tutor specialises in specific curricula, not generic subject knowledge. Browse who teaches what, then tell us what you need and we match you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/tutors/` },
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/tutors/" }),
};

const CRUMBS = [homeCrumb, { name: "Our Tutors", path: "/tutors/" }];

export default function TutorsPage() {
  // Tutors are listed with surnames abbreviated ("Sarah A."), which is what the
  // page shows and therefore what the markup must say — inventing full names to
  // satisfy a schema validator would be marking up something that isn't here.
  // `worksFor` ties each one to the organisation, which is the signal that
  // matters: these are our staff, not a directory of unaffiliated freelancers.
  const tutorsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${abs("/tutors/")}#tutors`,
    name: "MyStudyAlly tutors",
    numberOfItems: TUTORS.length,
    itemListElement: TUTORS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: t.name,
        jobTitle: `${t.expertise} tutor`,
        description: t.bio ?? `${t.qual}. ${t.years}. Teaches ${t.expertise}.`,
        image: abs(`/images/tutors/${t.photoId}.webp`),
        knowsAbout: t.tags.flatMap((tag) => t.subjects.map((sub) => `${tag} ${sub}`)),
        worksFor: { "@id": ORGANIZATION_ID },
      },
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${abs("/tutors/")}#faq`,
    mainEntity: ABOUT_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd
        nodes={[
          webPageJsonLd({
            type: "CollectionPage",
            title: TITLE,
            description: DESCRIPTION,
            path: "/tutors/",
            crumbs: CRUMBS,
          }),
          breadcrumbJsonLd(CRUMBS),
          tutorsJsonLd,
          faqJsonLd,
        ]}
      />

      {/* Hero */}
      <section className="px-[20px] pb-[20px] pt-[28px] md:px-[clamp(20px,5vw,32px)] md:pb-[8px] md:pt-[clamp(36px,5vw,72px)]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-11 font-extrabold tracking-[0.14em] text-muted md:text-12 md:font-bold">
              OUR TUTORS
            </div>
            <h1 className="mt-[12px] text-30 font-extrabold leading-[1.14] tracking-[-0.02em] [text-wrap:balance] md:mt-[16px] md:text-d48 md:leading-[1.08]">
              Find a tutor who knows your exam board
            </h1>
            <p className="mt-[12px] text-14 leading-[1.65] text-muted md:mt-[16px] md:text-16 md:leading-[26px]">
              Every tutor here specialises in specific curricula, not generic subject knowledge.
              Browse who teaches what — then tell us what you need, and our team matches you.
            </p>
            <p className="mt-[12px] text-12 leading-[1.55] text-muted-3 md:mt-[14px] md:text-13 md:leading-[18px]">
              Tutors are shown for reference. Matching is handled by our team — there&#39;s no
              direct booking here.
            </p>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="pb-[28px] pt-0 md:px-[clamp(20px,5vw,32px)] md:pb-[56px] md:pt-[32px]">
        <div className="mx-auto max-w-container">
          <TutorGrid />
        </div>
      </section>

      {/* Matching CTA */}
      <section className="bg-surface-dark px-[20px] pb-[34px] pt-[32px] md:px-[clamp(20px,5vw,32px)] md:pb-[60px] md:pt-[56px]">
        <div className="mx-auto flex max-w-container flex-col md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-[48px] md:gap-y-[28px]">
          <div className="max-w-[640px]">
            <div className="mb-[12px] text-10_5 font-extrabold tracking-[0.16em] text-muted-2 md:mb-[14px] md:text-11 md:font-bold">
              TUTOR MATCHING
            </div>
            <h2 className="text-23 font-extrabold leading-[1.2] text-white [text-wrap:balance] md:text-d30 md:leading-[1.15]">
              Don&#39;t see the exact match you need?
            </h2>
            <p className="mt-[10px] text-13_5 leading-[1.65] text-muted-4 md:mt-[12px] md:text-15 md:leading-[1.7]">
              Tell us what your child needs and we&#39;ll find the right tutor — even if
              they&#39;re not featured here.
            </p>
          </div>
          <Link
            href="/contact/"
            className="mt-[20px] flex min-h-[52px] shrink-0 items-center justify-center whitespace-nowrap rounded-[14px] bg-primary text-14_5 font-extrabold tracking-[0.02em] text-white shadow-[0_4px_0_#49AD00] hover:bg-primary-bright hover:text-white md:mt-0 md:inline-block md:min-h-0 md:rounded-[16px] md:px-[26px] md:py-[14px] md:text-14 md:tracking-[0.03em]"
          >
            Request a match
          </Link>
        </div>
      </section>

      {/* Get started + FAQ */}
      {/* Mobile runs the questions first and closes on the CTA card, per
          "Mobile FAQ" then "Mobile Closing CTA". */}
      <section id="faq" className="px-[20px] pb-[28px] pt-[32px] md:px-[clamp(20px,5vw,32px)] md:pb-[72px] md:pt-[56px]">
        <div className="mx-auto flex max-w-container flex-col-reverse gap-[30px] md:grid md:items-start md:gap-[24px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <GetStartedPanel
            headline="Ready to get started?"
            sub="Submit an inquiry and we'll match you with a tutor within 24h."
          />
          <div>
            <h2 className="mb-[6px] text-21 font-extrabold tracking-[-0.01em] md:mb-[20px] md:text-d28">
              Common questions
            </h2>
            <FaqList items={ABOUT_FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
