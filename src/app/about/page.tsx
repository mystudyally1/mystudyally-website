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

// Mobile ("About Mobile.dc.html") stacks each row on an 18px rhythm with a
// small tracked number; the three-column rule starts at md.
const rowClass =
  "flex flex-col gap-[6px] border-t border-border py-[18px] md:grid md:gap-[clamp(10px,3vw,48px)] md:py-[28px] md:[grid-template-columns:44px_minmax(min(100%,240px),1fr)_minmax(min(100%,240px),1fr)]";
const rowNum =
  "text-11 font-extrabold leading-none tracking-[0.1em] text-muted-3 md:pt-[1px] md:text-24 md:tracking-[0.02em]";
const rowTitle = "text-16 font-extrabold md:text-18";
const rowBody =
  "max-w-[640px] text-13_5 leading-[1.7] text-muted md:col-start-auto md:text-15";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-[20px] pb-[26px] pt-[28px] md:px-[clamp(20px,5vw,32px)] md:pb-[8px] md:pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[640px]">
            <div className="text-11 font-extrabold tracking-[0.14em] text-muted md:text-12 md:font-bold">
              ABOUT US
            </div>
            <h1 className="mt-[12px] text-30 font-extrabold leading-[1.14] tracking-[-0.02em] [text-wrap:balance] md:mt-[16px] md:text-d48 md:leading-[52px]">
              Built around how tutoring actually works
            </h1>
            <p className="mt-[14px] text-14 leading-[1.65] text-muted [text-wrap:pretty] md:mt-[16px] md:text-16 md:leading-[26px]">
              MyStudyAlly matches students with tutors who specialise in their exact curriculum,
              manages every session through a single platform, and keeps a record of everything —
              so nothing depends on memory or a missed WhatsApp message.
            </p>
            <p className="mt-[14px] text-12 leading-[1.5] text-muted-3 md:text-13 md:leading-[18px]">
              Founded in 2026. Ilford, United Kingdom.
            </p>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="px-[20px] pb-[32px] pt-[6px] md:px-[clamp(20px,5vw,32px)] md:pb-[64px] md:pt-[56px]">
        <div className="mx-auto max-w-container">
          <div className="grid items-stretch gap-[22px] md:gap-[56px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
            <div className="flex max-w-[640px] flex-col justify-center">
              <h2 className="mb-[14px] text-22 font-extrabold tracking-[-0.01em] md:mb-[20px] md:text-d30">
                Our story
              </h2>
              <p className="text-14 leading-[1.75] text-muted [text-wrap:pretty] md:text-15 md:leading-[1.8]">
                MyStudyAlly started from a simple observation: most tutoring platforms match on
                subject, not curriculum — and the difference between teaching IGCSE Physics and A
                Level Physics is significant. We built a platform where curriculum-matching is the
                starting point, not an afterthought, with every session recorded and every hour
                tracked, so families always know exactly what they&#39;re paying for and what
                their child is learning.
              </p>
              <p className="mt-[16px] text-14 leading-[1.75] text-muted [text-wrap:pretty] md:mt-[18px] md:text-15 md:leading-[1.8]">
                Before this, we spent years watching families juggle tutoring over WhatsApp —
                sessions arranged by memory, hours nobody counted, tutors teaching a syllabus
                they&#39;d never sat. We built MyStudyAlly to be the version of tutoring
                we&#39;d want for our own families: matched to the exact exam board, recorded,
                and accountable. If something isn&#39;t right, you write to us directly.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] shadow-[0_2px_4px_rgba(60,60,60,0.05),0_18px_36px_-14px_rgba(60,60,60,0.22)] md:aspect-auto md:min-h-[460px] md:rounded-[26px] md:shadow-[0_2px_4px_rgba(60,60,60,0.05),0_28px_56px_-16px_rgba(60,60,60,0.22)]">
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
      <section className="bg-surface-alt px-[20px] pb-[34px] pt-[32px] md:px-[clamp(20px,5vw,32px)] md:pb-[76px] md:pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="max-w-[720px]">
            <div className="text-11 font-extrabold tracking-[0.14em] text-muted md:text-12 md:font-bold">
              THE PROCESS
            </div>
            <h2 className="mb-[8px] mt-[12px] text-22 font-extrabold tracking-[-0.01em] md:mt-[14px] md:text-d30">
              How we vet tutors
            </h2>
            <p className="mb-[20px] text-14 leading-[1.65] text-muted [text-wrap:pretty] md:mb-[12px] md:text-15 md:leading-[1.7]">
              Every page on this site says our tutors are vetted. Here is exactly what that means.
            </p>
          </div>
          <div className="flex flex-col">
            {VETTING_STEPS.map((s) => (
              <div key={s.num} className={rowClass}>
                <span className={rowNum}>{s.num}</span>
                <h3 className={rowTitle}>{s.title}</h3>
                <p className={rowBody}>{s.body}</p>
              </div>
            ))}
          </div>
          <p className="border-t border-border pt-[18px] text-12 leading-[1.6] text-muted-3 md:pt-[24px] md:text-13 md:leading-[18px]">
            {numberWord(TUTORS.length)} tutors currently teach on MyStudyAlly. Every one of them
            has been through this process.
          </p>
        </div>
      </section>

      {/* How we operate */}
      <section className="px-[20px] pb-[34px] pt-[32px] md:px-[clamp(20px,5vw,32px)] md:pb-[80px] md:pt-[72px]">
        <div className="mx-auto max-w-container">
          <h2 className="mb-[6px] text-22 font-extrabold tracking-[-0.01em] md:mb-[12px] md:text-d30">
            How we operate
          </h2>
          <div className="flex flex-col">
            {ABOUT_ROWS.map((r) => (
              <div key={r.num} className={rowClass}>
                <span className={rowNum}>{r.num}</span>
                <h3 className={rowTitle}>{r.title}</h3>
                <p className={rowBody}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DarkCtaSection
        headline={"Ready to get started?"}
        sub={"Tell us what your child needs — we'll take it from there."}
      />

      {/* Get started + FAQ */}
      <section id="faq" className="px-[20px] pb-[36px] pt-[28px] md:px-[clamp(20px,5vw,32px)] md:pb-[72px] md:pt-[56px]">
        <div className="mx-auto grid max-w-container items-start gap-[20px] md:gap-[24px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <GetStartedPanel
            headline="Ready to get started?"
            sub="Submit an inquiry and we'll match you with a tutor within 24h."
          />
          <div>
            <h2 className="mb-[16px] text-21 font-extrabold tracking-[-0.01em] md:mb-[20px] md:text-d28">
              Common Questions
            </h2>
            <FaqList items={ABOUT_FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
