import Link from "next/link";
import Image from "next/image";
import { GetStartedPanel } from "@/components/marketing/GetStartedPanel";
import { CURRICULA } from "@/data/curricula";
import { FEATURED_TUTORS } from "@/data/tutors";

// Every value here is taken from "website design/MyStudyAlly Homepage.dc.html".
const HERO_TRUST = [
  "Vetted, curriculum-matched tutors",
  "Every session recorded",
  "Free trial, no card required",
];

const PROOF_STRIP = [
  "10 curricula covered",
  "Every session recorded",
  "Free 30-minute trial",
  "Available across the UAE, UK, USA, Canada, and Pakistan",
];

const STEPS = [
  { num: "01", title: "Tell us what you need.", body: "Your curriculum, subjects, and year group. Two minutes." },
  {
    num: "02",
    title: "We match you with a tutor.",
    body: "Our team — not an algorithm — pairs you with someone who specialises in your exact exam board. Not a generalist.",
  },
  {
    num: "03",
    title: "Start with a free trial.",
    body: "No payment required. Meet your tutor and see how the first session goes.",
  },
  {
    num: "04",
    title: "Learn on your schedule.",
    body: "Sessions run on Zoom, every one recorded, so nothing is missed if a session is skipped.",
  },
];

const PILLARS = [
  {
    num: "01",
    title: "Syllabus-matched tutors",
    body: "Matched to your child's exact exam board, tier, and subject combination — never a generalist guess.",
  },
  {
    num: "02",
    title: "Every session recorded",
    body: "Revisit any worked example as many times as needed before the exam. Nothing is lost if a class is missed.",
  },
  {
    num: "03",
    title: "Managed, not DIY",
    body: "Our team handles scheduling and tutor matching, so you're not managing another app.",
  },
];

const PRICING_SNAPSHOT = [
  { label: "Starter — 4 classes", price: "$45", detail: "$11.25 per class · 1 subject" },
  {
    label: "Academic+ — 16 classes",
    price: "$135",
    detail: "$8.44 per class · multiple subjects",
    recommended: true,
  },
  { label: "Complete — 32 classes", price: "$239", detail: "$7.47 per class · sibling sharing" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-container items-center gap-[clamp(32px,4vw,56px)] px-[clamp(20px,5vw,32px)] pb-[72px] pt-[76px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          <div>
            <div className="text-13 font-bold uppercase tracking-[0.02em] text-muted-3">
              Online Tutoring, Properly Managed
            </div>
            <h1 className="mt-[22px] text-d52 font-extrabold leading-[1.07] tracking-[-0.02em] [text-wrap:balance]">
              Curriculum-matched tutoring, without the guesswork
            </h1>
            <p className="mt-[22px] max-w-[46ch] text-15_5 leading-[1.7] text-muted">
              We match your child with a vetted tutor who already knows their exam board. IGCSE,
              GCSE, A Levels, IB, and seven more.
            </p>
            <div className="mt-[28px] flex flex-wrap gap-[10px]">
              {HERO_TRUST.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-[8px] whitespace-nowrap rounded-pill bg-primary-light px-[14px] py-[8px] text-12 font-bold text-primary-shadow"
                >
                  <span className="font-extrabold">✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-[14px] text-12 font-bold uppercase tracking-[0.1em] text-muted-3">
              Which curriculum is your child studying?
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              {CURRICULA.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}/`}
                  className="flex flex-col gap-[3px] rounded-[14px] border border-border bg-white px-[16px] py-[14px] text-body transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-[2px] hover:border-link-light-2 hover:text-body hover:shadow-[0_3px_0_#E5E5E5]"
                >
                  <span className="text-14_5 font-bold">{c.shortName}</span>
                  <span className="text-11_5 font-semibold tracking-[0.02em] text-muted-3">
                    {c.tagline}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-[14px]">
              <Link
                href="/contact/"
                className="border-b-2 border-primary pb-[2px] text-13 font-bold text-body hover:text-link"
              >
                Not sure which curriculum? Talk to us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="px-[clamp(20px,5vw,32px)]">
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-[16px] gap-y-[8px] border-y border-border py-[18px] text-center text-12 font-bold uppercase tracking-[0.08em] text-muted-3">
          {PROOF_STRIP.map((item, i) => (
            <span key={item} className="flex items-center gap-[16px]">
              {i > 0 && <span className="text-border">·</span>}
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-[24px] bg-surface-dark px-[clamp(20px,5vw,32px)] pb-[76px] pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="mb-[52px] max-w-[640px]">
            <div className="mb-[14px] text-11 font-bold tracking-[0.16em] text-muted-2">
              HOW IT WORKS
            </div>
            <h2 className="text-d34 font-extrabold tracking-[-0.01em] text-white [text-wrap:balance]">
              From inquiry to first session, <span className="text-muted-2">we handle it.</span>
            </h2>
          </div>
          <div className="grid gap-y-[32px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex flex-col gap-[14px] border-l border-white/[0.22] px-[28px] pb-[8px] pt-[4px]"
              >
                <span className="text-11 font-bold tracking-[0.16em] text-muted-2">{step.num}</span>
                <h3 className="text-18 font-bold text-white">{step.title}</h3>
                <p className="text-13_5 leading-[1.7] text-muted-4">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[72px] pt-[40px]">
        <div className="mx-auto max-w-container">
          <h2 className="mb-[36px] max-w-[560px] text-d34 font-extrabold tracking-[-0.01em] [text-wrap:balance]">
            Some of the tutors you could be matched with
          </h2>
          <div className="grid gap-[20px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
            {FEATURED_TUTORS.map((t) => (
              <div
                key={t.photoId}
                className="flex flex-col overflow-hidden rounded-[22px] border-2 border-border bg-white shadow-[0_2px_0_#E5E5E5] transition-[box-shadow,transform] duration-[250ms] hover:-translate-y-[3px] hover:shadow-[0_4px_0_#E5E5E5]"
              >
                <div className="relative h-[200px] bg-surface-alt">
                  <Image
                    src={`/images/tutors/${t.photoId}.webp`}
                    alt={t.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-[8px] px-[22px] pb-[22px] pt-[20px]">
                  <h3 className="text-17 font-bold">{t.name}</h3>
                  <div className="text-12 font-semibold text-muted">
                    {t.qual} · {t.years}
                  </div>
                  <div className="text-12 font-bold leading-[1.5] text-link">{t.expertise}</div>
                  <p className="mb-[8px] mt-[4px] flex-1 text-12 leading-[1.6] text-muted">
                    {t.bio}
                  </p>
                  <Link
                    href="/contact/"
                    className="border-t-2 border-border pt-[14px] text-11_5 font-bold tracking-[0.06em] text-body hover:text-link"
                  >
                    INQUIRE ABOUT THIS TUTOR ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[32px] text-center">
            <Link
              href="/tutors/"
              className="border-b-2 border-primary pb-[2px] text-13 font-bold text-body hover:text-link"
            >
              Meet All Our Tutors ↗
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="mt-[24px] bg-surface-alt px-[clamp(20px,5vw,32px)] pb-[60px] pt-[56px]">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="mb-[32px] text-d30 font-extrabold tracking-[-0.01em]">What you get</h2>
          <div className="flex flex-col">
            {PILLARS.map((p) => (
              <div
                key={p.num}
                className="grid gap-[32px] border-t border-border py-[26px] grid-cols-[44px_1fr] md:[grid-template-columns:44px_minmax(min(100%,240px),1fr)_minmax(min(100%,240px),1fr)]"
              >
                <span className="pt-[1px] text-24 font-extrabold leading-none tracking-[0.02em] text-muted-3">
                  {p.num}
                </span>
                <h3 className="text-18 font-bold text-body">{p.title}</h3>
                <p className="col-start-2 md:col-start-auto text-14_5 leading-[1.75] text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing snapshot */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[64px] pt-[56px]">
        <div className="mx-auto max-w-[1080px]">
          <div className="rounded-[18px] border border-border bg-white px-[clamp(20px,5vw,32px)] py-[28px]">
            <h2 className="text-d22 font-extrabold">
              Not sure yet? Start with a free trial session.
            </h2>
            <p className="mt-[10px] max-w-[70ch] text-14 leading-[1.7] text-muted">
              No payment required — submit an inquiry and we&#39;ll match you with a tutor for a
              trial before you commit to a package.
            </p>
          </div>
          <p className="mb-[28px] mt-[20px] text-16 leading-[1.6] text-body">
            MyStudyAlly is new. Your trial session is free precisely so you don&#39;t have to
            take our word for it.
          </p>
          <div className="grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {PRICING_SNAPSHOT.map((p) => (
              <div
                key={p.label}
                className={
                  "relative flex flex-col gap-[6px] rounded-[18px] bg-white px-[clamp(20px,5vw,32px)] py-[28px] " +
                  (p.recommended ? "border-2 border-primary" : "border border-border")
                }
              >
                {p.recommended && (
                  <span className="absolute -top-[12px] right-[20px] rounded-pill bg-primary px-[12px] py-[4px] text-10 font-extrabold tracking-[0.1em] text-white">
                    RECOMMENDED
                  </span>
                )}
                <div className="text-12 font-bold uppercase tracking-[0.1em] text-muted-3">
                  {p.label}
                </div>
                <div className="text-d34 font-extrabold tracking-[-0.01em]">
                  {p.price} <span className="text-14 font-semibold text-muted">USD</span>
                </div>
                <div className="text-13 font-semibold text-muted">{p.detail}</div>
              </div>
            ))}
          </div>
          <p className="mt-[14px] text-13 leading-[1.7] text-muted">
            Six plans from 4 to 32 classes. No registration or platform fees — the plan price is
            all you pay.
          </p>
          <div className="mt-[18px]">
            <Link
              href="/pricing/"
              className="border-b-2 border-primary pb-[2px] text-13 font-bold text-body hover:text-link"
            >
              See full pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* Get started + FAQ */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[72px] pt-[56px]">
        <div className="mx-auto grid max-w-container items-start gap-[24px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <GetStartedPanel
            headline="Ready to get started?"
            sub="Submit an inquiry and we'll match you with a tutor within 24h."
          />
          <div className="max-w-[520px] self-center">
            <h2 className="text-d28 font-extrabold tracking-[-0.01em]">
              Questions before you start?
            </h2>
            <p className="mt-[16px] text-16 leading-[26px] text-muted [text-wrap:pretty]">
              Pricing, scheduling, tutor vetting, recordings, and what happens to unused classes —
              all answered in one place.
            </p>
            <Link
              href="/faq/"
              className="mt-[20px] inline-block border-b-2 border-primary pb-[2px] text-14 font-bold text-body hover:text-link"
            >
              Read the FAQ →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
