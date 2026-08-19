import type { Metadata } from "next";
import Link from "next/link";
import { GetStartedPanel } from "@/components/marketing/GetStartedPanel";
import { FaqList } from "@/components/ui/FaqList";
import { TutorGrid } from "@/components/marketing/TutorGrid";
import { ABOUT_FAQS } from "@/data/about";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Tutors",
  description:
    "Every MyStudyAlly tutor specialises in specific curricula, not generic subject knowledge. Browse who teaches what — then tell us what you need and our team matches you.",
  alternates: { canonical: `${SITE_URL}/tutors/` },
};

export default function TutorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[8px] pt-[clamp(36px,5vw,72px)]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-12 font-bold tracking-[0.14em] text-muted">OUR TUTORS</div>
            <h1 className="mt-[16px] text-d48 font-extrabold leading-[1.08] tracking-[-0.02em] [text-wrap:balance]">
              Find a tutor who knows your exam board
            </h1>
            <p className="mt-[16px] text-16 leading-[26px] text-muted">
              Every tutor here specialises in specific curricula, not generic subject knowledge.
              Browse who teaches what — then tell us what you need, and our team matches you.
            </p>
            <p className="mt-[14px] text-13 leading-[18px] text-muted-3">
              Tutors are shown for reference. Matching is handled by our team — there&#39;s no
              direct booking here.
            </p>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[56px] pt-[32px]">
        <div className="mx-auto max-w-container">
          <TutorGrid />
        </div>
      </section>

      {/* Matching CTA */}
      <section className="bg-surface-dark px-[clamp(20px,5vw,32px)] pb-[60px] pt-[56px]">
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-x-[48px] gap-y-[28px]">
          <div className="max-w-[640px]">
            <div className="mb-[14px] text-11 font-bold tracking-[0.16em] text-muted-2">
              TUTOR MATCHING
            </div>
            <h2 className="text-d30 font-extrabold leading-[1.15] text-white [text-wrap:balance]">
              Don&#39;t see the exact match you need?
            </h2>
            <p className="mt-[12px] text-15 leading-[1.7] text-muted-4">
              Tell us what your child needs and we&#39;ll find the right tutor — even if
              they&#39;re not featured here.
            </p>
          </div>
          <Link
            href="/contact/"
            className="shrink-0 whitespace-nowrap rounded-[16px] bg-primary px-[26px] py-[14px] text-14 font-extrabold tracking-[0.03em] text-white shadow-[0_4px_0_#49AD00] hover:bg-primary-bright hover:text-white"
          >
            Request a match
          </Link>
        </div>
      </section>

      {/* Get started + FAQ */}
      <section id="faq" className="px-[clamp(20px,5vw,32px)] pb-[72px] pt-[56px]">
        <div className="mx-auto grid max-w-container items-start gap-[24px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <GetStartedPanel
            headline="Ready to get started?"
            sub="Submit an inquiry and we'll match you with a tutor within 24h."
          />
          <div>
            <h2 className="mb-[20px] text-d28 font-extrabold tracking-[-0.01em]">
              Common Questions
            </h2>
            <FaqList items={ABOUT_FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
