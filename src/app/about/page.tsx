import type { Metadata } from "next";
import Image from "next/image";
import { DarkCtaSection } from "@/components/marketing/DarkCtaSection";
import { GetStartedPanel } from "@/components/marketing/GetStartedPanel";
import { FaqList } from "@/components/ui/FaqList";
import { ABOUT_FAQS, ABOUT_ROWS, VETTING_STEPS } from "@/data/about";
import { TUTORS } from "@/data/tutors";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MyStudyAlly matches students with tutors who specialise in their exact curriculum, manages every session through one platform, and keeps a record of everything.",
  alternates: { canonical: `${SITE_URL}/about/` },
};

const numberWord = (n: number) => {
  const words: Record<number, string> = {
    20: "Twenty",
    21: "Twenty-one",
    22: "Twenty-two",
    23: "Twenty-three",
    24: "Twenty-four",
    25: "Twenty-five",
    26: "Twenty-six",
    27: "Twenty-seven",
    28: "Twenty-eight",
    29: "Twenty-nine",
    30: "Thirty",
  };
  return words[n] ?? String(n);
};

const rowClass =
  "grid gap-[clamp(10px,3vw,48px)] border-t border-border py-[28px] [grid-template-columns:44px_minmax(min(100%,240px),1fr)_minmax(min(100%,240px),1fr)]";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[8px] pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-12 font-bold tracking-[0.14em] text-muted">ABOUT US</div>
            <h1 className="mt-[16px] text-d48 font-extrabold leading-[52px] tracking-[-0.02em] [text-wrap:balance]">
              Built around how tutoring actually works
            </h1>
            <p className="mt-[16px] text-16 leading-[26px] text-muted">
              MyStudyAlly matches students with tutors who specialise in their exact curriculum,
              manages every session through a single platform, and keeps a record of everything —
              so nothing depends on memory or a missed WhatsApp message.
            </p>
            <p className="mt-[14px] text-13 leading-[18px] text-muted-3">
              Founded in 2026. Ilford, United Kingdom.
            </p>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[64px] pt-[56px]">
        <div className="mx-auto max-w-container">
          <div className="grid items-stretch gap-[56px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
            <div className="flex max-w-[640px] flex-col justify-center">
              <h2 className="mb-[20px] text-d30 font-extrabold tracking-[-0.01em]">Our story</h2>
              <p className="text-15 leading-[1.8] text-muted">
                MyStudyAlly started from a simple observation: most tutoring platforms match on
                subject, not curriculum — and the difference between teaching IGCSE Physics and A
                Level Physics is significant. We built a platform where curriculum-matching is the
                starting point, not an afterthought, with every session recorded and every hour
                tracked, so families always know exactly what they&#39;re paying for and what
                their child is learning.
              </p>
              <p className="mt-[18px] text-15 leading-[1.8] text-muted">
                Before this, we spent years watching families juggle tutoring over WhatsApp —
                sessions arranged by memory, hours nobody counted, tutors teaching a syllabus
                they&#39;d never sat. We built MyStudyAlly to be the version of tutoring
                we&#39;d want for our own families: matched to the exact exam board, recorded,
                and accountable. If something isn&#39;t right, you write to us directly.
              </p>
            </div>
            <div className="relative min-h-[460px] overflow-hidden rounded-[26px] shadow-[0_2px_4px_rgba(60,60,60,0.05),0_28px_56px_-16px_rgba(60,60,60,0.22)]">
              <Image
                src="/images/site/founder-photo.webp"
                alt="The MyStudyAlly team"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: "center 16%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How we vet tutors */}
      <section className="bg-surface-alt px-[clamp(20px,5vw,32px)] pb-[76px] pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[720px]">
            <div className="text-12 font-bold tracking-[0.14em] text-muted">THE PROCESS</div>
            <h2 className="mb-[8px] mt-[14px] text-d30 font-extrabold tracking-[-0.01em]">
              How we vet tutors
            </h2>
            <p className="mb-[12px] text-15 leading-[1.7] text-muted">
              Every page on this site says our tutors are vetted. Here is exactly what that means.
            </p>
          </div>
          <div className="flex flex-col">
            {VETTING_STEPS.map((s) => (
              <div key={s.num} className={rowClass}>
                <span className="pt-[1px] text-24 font-extrabold leading-none tracking-[0.02em] text-muted-3">
                  {s.num}
                </span>
                <h3 className="text-18 font-extrabold">{s.title}</h3>
                <p className="max-w-[640px] text-15 leading-[1.7] text-muted">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="border-t border-border pt-[24px] text-13 leading-[18px] text-muted-3">
            {numberWord(TUTORS.length)} tutors currently teach on MyStudyAlly. Every one of them
            has been through this process.
          </p>
        </div>
      </section>

      {/* How we operate */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[80px] pt-[72px]">
        <div className="mx-auto max-w-container">
          <h2 className="mb-[12px] text-d30 font-extrabold tracking-[-0.01em]">How we operate</h2>
          <div className="flex flex-col">
            {ABOUT_ROWS.map((r) => (
              <div key={r.num} className={rowClass}>
                <span className="pt-[1px] text-24 font-extrabold leading-none tracking-[0.02em] text-muted-3">
                  {r.num}
                </span>
                <h3 className="text-18 font-extrabold">{r.title}</h3>
                <p className="max-w-[640px] text-15 leading-[1.7] text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DarkCtaSection
        headline={"Ready to get started?"}
        sub={"Tell us what your child needs — we&#39;ll take it from there."}
      />

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
