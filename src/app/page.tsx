import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CtaBand } from "@/components/marketing/CtaBand";
import { CURRICULA } from "@/data/curricula";
import { FEATURED_TUTORS } from "@/data/tutors";
import { SLA_RESPONSE_TIME } from "@/lib/constants";

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
      <Section className="pb-9 pt-14">
        <Container className="grid items-center gap-10 sm:grid-cols-2 sm:gap-14">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-muted-3">
              Online Tutoring, Properly Managed
            </div>
            <h1 className="mt-5 text-d-6xl text-ink">
              Curriculum-matched tutoring, without the guesswork
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted">
              We match your child with a vetted tutor who already knows their exam board. IGCSE,
              GCSE, A Levels, IB, and seven more.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {HERO_TRUST.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-primary-light px-3.5 py-2 text-xs font-bold text-primary-shadow"
                >
                  <span className="font-extrabold">✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-wide text-muted-3">
              Which curriculum is your child studying?
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {CURRICULA.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}/`}
                  className="flex flex-col gap-0.5 rounded-md border border-border bg-white px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-link-light-2 hover:shadow-card"
                >
                  <span className="text-sm font-bold text-ink">{c.shortName}</span>
                  <span className="text-xs font-semibold text-muted-3">{c.tagline}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/contact/"
              className="mt-3.5 inline-block border-b-2 border-primary pb-0.5 text-sm font-bold text-ink"
            >
              Not sure which curriculum? Talk to us →
            </Link>
          </div>
        </Container>
      </Section>

      {/* Proof strip */}
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-y border-border py-4.5 text-center text-xs font-bold uppercase tracking-wide text-muted-3">
          {PROOF_STRIP.map((item, i) => (
            <span key={item} className="flex items-center gap-4">
              {i > 0 && <span className="text-border">·</span>}
              {item}
            </span>
          ))}
        </div>
      </Container>

      {/* How it works */}
      <Section className="mt-6 bg-surface-dark">
        <Container>
          <div className="mb-11 max-w-xl">
            <div className="mb-3.5 text-eyebrow text-muted-2">HOW IT WORKS</div>
            <h2 className="text-d-lg text-white">
              From inquiry to first session, <span className="text-muted-2">we handle it.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col gap-3.5 border-l border-white/20 py-1 pl-6">
                <span className="text-eyebrow text-muted-2">{step.num}</span>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-4">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Tutors */}
      <Section>
        <Container>
          <h2 className="mb-9 max-w-lg text-d-lg text-ink">
            Some of the tutors you could be matched with
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_TUTORS.map((t) => (
              <div
                key={t.slug}
                className="flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-white shadow-[0_2px_0_#E5E5E5] transition hover:-translate-y-1 hover:shadow-[0_4px_0_#E5E5E5]"
              >
                <div className="relative h-50 bg-surface-alt">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-bold text-ink">{t.name}</h3>
                  <div className="text-xs font-semibold text-muted">
                    {t.qualification} · {t.years}
                  </div>
                  <div className="text-xs font-bold leading-relaxed text-link">{t.expertise}</div>
                  <p className="flex-1 text-xs leading-relaxed text-muted">{t.bio}</p>
                  <Link
                    href="/contact/"
                    className="border-t-2 border-border pt-3.5 text-xs font-bold tracking-wide text-ink hover:text-link"
                  >
                    INQUIRE ABOUT THIS TUTOR ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/tutors/" className="border-b-2 border-primary pb-0.5 text-sm font-bold text-ink">
              Meet All Our Tutors ↗
            </Link>
          </div>
        </Container>
      </Section>

      {/* What you get */}
      <Section className="mt-6 bg-surface-alt">
        <Container className="max-w-4xl">
          <h2 className="mb-8 text-d-md text-ink">What you get</h2>
          <div className="flex flex-col">
            {PILLARS.map((p) => (
              <div
                key={p.num}
                className="grid grid-cols-[44px_1fr] gap-6 border-t border-border py-6 sm:grid-cols-[44px_1fr_1fr]"
              >
                <span className="text-2xl font-extrabold text-muted-3">{p.num}</span>
                <h3 className="text-lg font-bold text-ink">{p.title}</h3>
                <p className="text-md leading-relaxed text-muted sm:col-start-3">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Pricing snapshot */}
      <Section>
        <Container className="max-w-4xl">
          <Card>
            <h2 className="text-d-sm text-ink">Not sure yet? Start with a free trial session.</h2>
            <p className="mt-2.5 max-w-[70ch] text-sm leading-relaxed text-muted">
              No payment required — submit an inquiry and we&rsquo;ll match you with a tutor for a
              trial before you commit to a package.
            </p>
          </Card>
          <p className="my-7 text-lg text-ink">
            MyStudyAlly is new. Your trial session is free precisely so you don&rsquo;t have to
            take our word for it.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PRICING_SNAPSHOT.map((p) => (
              <div
                key={p.label}
                className={
                  "relative flex flex-col gap-1.5 rounded-xl border bg-white px-6 py-7 " +
                  (p.recommended ? "border-2 border-primary" : "border-border")
                }
              >
                {p.recommended && (
                  <span className="absolute -top-3 right-5 rounded-pill bg-primary px-3 py-1 text-[10px] font-extrabold tracking-wide text-white">
                    RECOMMENDED
                  </span>
                )}
                <div className="text-xs font-bold uppercase tracking-wide text-muted-3">
                  {p.label}
                </div>
                <div className="text-d-md text-ink">
                  {p.price} <span className="text-sm font-semibold text-muted">USD</span>
                </div>
                <div className="text-sm font-semibold text-muted">{p.detail}</div>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-sm text-muted">
            Six plans from 4 to 32 classes. No registration or platform fees — the plan price is
            all you pay.
          </p>
          <Link href="/pricing/" className="mt-4 inline-block border-b-2 border-primary pb-0.5 text-sm font-bold text-ink">
            See full pricing →
          </Link>
        </Container>
      </Section>

      {/* Get started + FAQ */}
      <Section>
        <Container className="grid items-start gap-6 lg:grid-cols-2">
          <CtaBand
            headline="Ready to get started?"
            sub={`Submit an inquiry and we'll match you with a tutor ${SLA_RESPONSE_TIME}.`}
          />
          <div className="self-center lg:max-w-[520px]">
            <h2 className="text-d-md text-ink">Questions before you start?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Pricing, scheduling, tutor vetting, recordings, and what happens to unused classes —
              all answered in one place.
            </p>
            <Link href="/faq/" className="mt-5 inline-block border-b-2 border-primary pb-0.5 text-sm font-bold text-ink">
              Read the FAQ →
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
