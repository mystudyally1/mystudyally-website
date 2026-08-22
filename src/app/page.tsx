import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GetStartedPanel } from "@/components/marketing/GetStartedPanel";
import { CURRICULA } from "@/data/curricula";
import { SnapRail } from "@/components/marketing/SnapRail";
import { FEATURED_TUTORS } from "@/data/tutors";
import { JsonLd } from "@/components/seo/JsonLd";
import { PLANS } from "@/data/pricing";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  abs,
  homeCrumb,
  breadcrumbJsonLd,
} from "@/lib/seo";
import {
  KNOWS_ABOUT,
  SERVICE_AREA_COUNTRIES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/constants";
import { pageSocial } from "@/lib/metadata";

/**
 * The homepage shipped with no `metadata` export at all, so it inherited the
 * root title and — more importantly — emitted no canonical. With `trailingSlash`
 * on, the same page is reachable as `/` and `/index.html`; without a canonical
 * nothing tells Google which one is the page.
 *
 * `title.absolute` bypasses the `%s — MyStudyAlly` template, which would
 * otherwise render "MyStudyAlly — … — MyStudyAlly".
 */
export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Online Tutoring Matched to Your Exam Board`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
  ...pageSocial({
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
};

// Every value here is taken from "website design/MyStudyAlly Homepage.dc.html".
// The last chip is shortened on mobile ("Homepage Mobile.dc.html") so it stays
// on one line next to the recording chip.
const HERO_TRUST: { full: string; short?: string }[] = [
  { full: "Vetted, curriculum-matched tutors" },
  { full: "Every session recorded" },
  { full: "Free trial, no card required", short: "Free trial, no card" },
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
  // The tutoring offering itself, priced from the real plan data so the
  // markup can never drift from what /pricing/ renders. `lowPrice` is taken
  // from the cheapest plan rather than hardcoded for the same reason.
  const prices = PLANS.map((p) => Number(p.price.replace(/[^0-9.]/g, ""))).filter(
    (n) => Number.isFinite(n),
  );
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    name: "Online 1-to-1 curriculum-matched tutoring",
    serviceType: "Online tutoring",
    description: SITE_DESCRIPTION,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: SERVICE_AREA_COUNTRIES.map((name) => ({ "@type": "Country", name })),
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: PLANS.length,
      url: abs("/pricing/"),
      availability: "https://schema.org/InStock",
    },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    inLanguage: "en-GB",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    keywords: [...KNOWS_ABOUT].join(", "),
    breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
  };

  // The ten curriculum pages, listed so the homepage tells a crawler what the
  // site's main sections are on first fetch rather than leaving it to discover
  // them through the mega menu.
  const curriculaListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#curricula`,
    name: "Curricula covered",
    itemListElement: CURRICULA.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.name} tutoring`,
      url: abs(`/${c.slug}/`),
    })),
  };

  return (
    <>
      <JsonLd
        nodes={[
          webPage,
          breadcrumbJsonLd([homeCrumb]),
          serviceJsonLd,
          curriculaListJsonLd,
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-container items-center gap-[28px] px-[20px] pb-[28px] pt-[32px] md:gap-[clamp(32px,4vw,56px)] md:px-[clamp(20px,5vw,32px)] md:pb-[72px] md:pt-[76px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          <div>
            <div className="text-10_5 font-bold uppercase tracking-[0.14em] text-muted-3 md:text-13 md:tracking-[0.02em]">
              Online Tutoring, Properly Managed
            </div>
            <h1 className="mt-[12px] text-30 font-extrabold leading-[1.14] tracking-[-0.02em] [text-wrap:balance] md:mt-[22px] md:text-d52 md:leading-[1.07]">
              Curriculum-matched tutoring, without the guesswork
            </h1>
            <p className="mt-[12px] max-w-[46ch] text-14 leading-[1.65] text-muted md:mt-[22px] md:text-15_5 md:leading-[1.7]">
              We match your child with a vetted tutor who already knows their exam board. IGCSE,
              GCSE, A Levels, IB, and seven more.
            </p>
            {/* Mobile-only: on a phone the picker and the form are both below
                the fold, so the design puts a jump CTA right under the intro
                ("Mobile Hero"). The desktop hero has no button. */}
            <Link
              href="/contact/"
              className="mt-[20px] flex items-center justify-center rounded-[14px] bg-primary py-[14px] text-14 font-extrabold tracking-[0.02em] text-white shadow-[0_4px_0_#49AD00] hover:bg-primary-bright hover:text-white md:hidden"
            >
              Submit an inquiry
            </Link>
            <div className="mt-[14px] flex flex-wrap gap-[7px] md:mt-[28px] md:gap-[10px]">
              {HERO_TRUST.map((t) => (
                <span
                  key={t.full}
                  className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-pill bg-primary-light px-[11px] py-[6px] text-11 font-bold text-primary-shadow md:gap-[8px] md:px-[14px] md:py-[8px] md:text-12"
                >
                  <span className="font-extrabold">✓</span>
                  {t.short ? (
                    <>
                      <span className="md:hidden">{t.short}</span>
                      <span className="hidden md:inline">{t.full}</span>
                    </>
                  ) : (
                    t.full
                  )}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-[10px] text-11 font-bold uppercase tracking-[0.1em] text-muted-3 md:mb-[14px] md:text-12">
              Which curriculum is your child studying?
            </div>
            <div className="grid grid-cols-2 gap-[8px] md:gap-[10px]">
              {CURRICULA.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}/`}
                  className="flex min-h-[62px] flex-col justify-center gap-[2px] rounded-[14px] border border-border bg-white px-[13px] py-[12px] text-body shadow-[0_2px_0_#EFEFEF] md:min-h-0 md:gap-[3px] md:px-[16px] md:py-[14px] md:shadow-none md:transition-[box-shadow,transform,border-color] md:duration-200 md:hover:-translate-y-[2px] md:hover:border-link-light-2 md:hover:text-body md:hover:shadow-[0_3px_0_#E5E5E5]"
                >
                  <span className="text-14 font-bold md:text-14_5">{c.shortName}</span>
                  <span className="text-10_5 font-semibold leading-[1.3] tracking-[0.02em] text-muted-3 md:text-11_5">
                    {c.tagline}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-[14px] text-center md:text-left">
              <Link
                href="/contact/"
                className="border-b-2 border-primary pb-[2px] text-12_5 font-bold text-body hover:text-link md:text-13"
              >
                Not sure which curriculum? Talk to us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="px-[20px] md:px-[clamp(20px,5vw,32px)]">
        <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-[10px] gap-y-[6px] border-y border-border py-[14px] text-center text-10 font-bold uppercase tracking-[0.08em] text-muted-3 md:gap-x-[16px] md:gap-y-[8px] md:py-[18px] md:text-12">
          {PROOF_STRIP.map((item, i) => (
            <span key={item} className="flex items-center gap-[10px] md:gap-[16px]">
              {i > 0 && <span className="text-border">·</span>}
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-[24px] bg-surface-dark px-[20px] pb-[40px] pt-[36px] md:px-[clamp(20px,5vw,32px)] md:pb-[76px] md:pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="mb-[22px] max-w-[640px] md:mb-[52px]">
            <div className="mb-[10px] text-10 font-bold tracking-[0.16em] text-muted-2 md:mb-[14px] md:text-11">
              HOW IT WORKS
            </div>
            <h2 className="text-23 font-extrabold tracking-[-0.01em] text-white [text-wrap:balance] md:text-d34">
              From inquiry to first session, <span className="text-muted-2">we handle it.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-[16px] md:grid md:gap-y-[32px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-[14px] md:flex-col md:gap-[14px] md:border-l md:border-white/[0.22] md:px-[28px] md:pb-[8px] md:pt-[4px]"
              >
                <span className="inline-flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-pill border border-white/[0.28] text-10_5 font-extrabold text-muted-2 md:h-auto md:w-auto md:rounded-none md:border-0 md:text-11 md:font-bold md:tracking-[0.16em]">
                  {step.num}
                </span>
                <div className="flex-1 border-b border-white/[0.14] pb-[16px] md:border-b-0 md:pb-0">
                  <h3 className="text-15 font-extrabold text-white md:text-18 md:font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-[5px] text-12_5 leading-[1.65] text-muted-4 md:mt-[14px] md:text-13_5 md:leading-[1.7]">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors */}
      <section className="pb-[8px] pt-[32px] md:px-[clamp(20px,5vw,32px)] md:pb-[72px] md:pt-[40px]">
        <div className="mx-auto max-w-container">
          <h2 className="mb-[4px] max-w-[560px] px-[20px] text-21 font-extrabold tracking-[-0.01em] [text-wrap:balance] md:mb-[36px] md:px-0 md:text-d34">
            Some of the tutors you could be matched with
          </h2>
          <SnapRail
            count={FEATURED_TUTORS.length}
            cardStep={284}
            railClass="gap-[12px] px-[20px] pb-[8px] pt-[16px] md:gap-[20px] md:px-0 md:pb-0 md:pt-0"
            gridClass="md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]"
          >
            {FEATURED_TUTORS.map((t) => (
              <div
                key={t.photoId}
                className="flex w-[272px] shrink-0 snap-center flex-col overflow-hidden rounded-[20px] border-2 border-border bg-white shadow-[0_2px_0_#E5E5E5] md:w-auto md:shrink md:rounded-[22px] md:transition-[box-shadow,transform] md:duration-[250ms] md:hover:-translate-y-[3px] md:hover:shadow-[0_4px_0_#E5E5E5]"
              >
                <div className="relative h-[168px] bg-surface-alt md:h-[200px]">
                  <Image
                    src={`/images/tutors/${t.photoId}.webp`}
                    alt={`${t.name}, ${t.expertise} tutor`}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-[6px] px-[18px] pb-[18px] pt-[16px] md:gap-[8px] md:px-[22px] md:pb-[22px] md:pt-[20px]">
                  <h3 className="text-16 font-extrabold md:text-17 md:font-bold">{t.name}</h3>
                  <div className="text-11 font-bold text-muted md:text-12 md:font-semibold">
                    {t.qual} · {t.years}
                  </div>
                  <div className="text-11 font-extrabold leading-[1.45] text-link md:text-12 md:font-bold md:leading-[1.5]">
                    {t.expertise}
                  </div>
                  <p className="mb-[8px] mt-[2px] flex-1 text-11_5 leading-[1.6] text-muted md:mt-[4px] md:text-12">
                    {t.bio}
                  </p>
                  <Link
                    href="/contact/"
                    className="flex min-h-[44px] items-center border-t-2 border-border pt-[12px] text-10_5 font-extrabold tracking-[0.06em] text-body hover:text-link md:min-h-0 md:pt-[14px] md:text-11_5 md:font-bold"
                  >
                    INQUIRE ABOUT THIS TUTOR ↗
                  </Link>
                </div>
              </div>
            ))}
          </SnapRail>
          <div className="mt-[14px] px-[20px] text-center md:mt-[32px] md:px-0">
            <Link
              href="/tutors/"
              className="border-b-2 border-primary pb-[2px] text-12_5 font-bold text-body hover:text-link md:text-13"
            >
              Meet all our tutors ↗
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="mt-[28px] bg-surface-alt px-[20px] pb-[36px] pt-[32px] md:mt-[24px] md:px-[clamp(20px,5vw,32px)] md:pb-[60px] md:pt-[56px]">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="mb-[6px] text-21 font-extrabold tracking-[-0.01em] md:mb-[32px] md:text-d30">
            What you get
          </h2>
          <div className="flex flex-col">
            {PILLARS.map((p) => (
              <div
                key={p.num}
                className="flex flex-col gap-[8px] border-t border-border py-[18px] md:grid md:gap-[32px] md:py-[26px] md:[grid-template-columns:44px_minmax(min(100%,240px),1fr)_minmax(min(100%,240px),1fr)]"
              >
                <span className="text-20 font-extrabold leading-none tracking-[0.02em] text-muted-3 md:pt-[1px] md:text-24">
                  {p.num}
                </span>
                <h3 className="text-15_5 font-extrabold text-body md:text-18 md:font-bold">
                  {p.title}
                </h3>
                <p className="text-13 leading-[1.7] text-muted md:col-start-auto md:text-14_5 md:leading-[1.75]">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing snapshot */}
      <section className="px-[20px] pb-[36px] pt-[32px] md:px-[clamp(20px,5vw,32px)] md:pb-[64px] md:pt-[56px]">
        <div className="mx-auto max-w-[1080px]">
          {/* Dashed, centred and on the alt surface on mobile, per the design. */}
          <div className="rounded-[14px] border border-dashed border-[#CFCFCF] bg-surface-alt p-[18px] text-center md:rounded-[18px] md:border-solid md:border-border md:bg-white md:px-[clamp(20px,5vw,32px)] md:py-[28px] md:text-left">
            <h2 className="text-15 font-extrabold md:text-d22">
              Not sure yet? Start with a free trial session.
            </h2>
            <p className="mt-[6px] max-w-[70ch] text-12 leading-[1.6] text-muted md:mt-[10px] md:text-14 md:leading-[1.7]">
              No payment required — submit an inquiry and we&#39;ll match you with a tutor for a
              trial before you commit to a package.
            </p>
          </div>
          <p className="mb-[18px] mt-[16px] text-13_5 leading-[1.65] text-body md:mb-[28px] md:mt-[20px] md:text-16 md:leading-[1.6]">
            MyStudyAlly is new. Your trial session is free precisely so you don&#39;t have to
            take our word for it.
          </p>
          <div className="flex flex-col gap-[10px] md:grid md:gap-[16px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {PRICING_SNAPSHOT.map((p) => (
              <div
                key={p.label}
                className={
                  "relative flex items-baseline justify-between gap-[12px] rounded-[16px] bg-white px-[18px] py-[16px] md:flex-col md:items-stretch md:gap-[6px] md:rounded-[18px] md:px-[clamp(20px,5vw,32px)] md:py-[28px] " +
                  (p.recommended ? "border-2 border-primary" : "border border-border")
                }
              >
                {p.recommended && (
                  <span className="absolute -top-[10px] right-[14px] rounded-pill bg-primary px-[10px] py-[3px] text-9_5 font-extrabold tracking-[0.1em] text-white md:-top-[12px] md:right-[20px] md:px-[12px] md:py-[4px] md:text-10">
                    RECOMMENDED
                  </span>
                )}
                <div className="md:contents">
                  <div className="text-10_5 font-extrabold uppercase tracking-[0.1em] text-muted-3 md:text-12 md:font-bold">
                    {p.label}
                  </div>
                  <div className="mt-[4px] text-11_5 font-bold text-muted md:order-3 md:mt-0 md:text-13 md:font-semibold">
                    {p.detail}
                  </div>
                </div>
                <div className="shrink-0 whitespace-nowrap text-24 font-black tracking-[-0.02em] md:order-2 md:text-d34 md:font-extrabold md:tracking-[-0.01em]">
                  {p.price} <span className="text-11 font-bold text-muted-3 md:text-14 md:font-semibold md:text-muted">USD</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-[12px] text-12 leading-[1.65] text-muted md:mt-[14px] md:text-13 md:leading-[1.7]">
            Six plans from 4 to 32 classes. No registration or platform fees — the plan price is
            all you pay.
          </p>
          <div className="mt-[14px] md:mt-[18px]">
            <Link
              href="/pricing/"
              className="border-b-2 border-primary pb-[2px] text-12_5 font-bold text-body hover:text-link md:text-13"
            >
              See full pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* Get started + FAQ */}
      <section className="px-[20px] pb-[28px] md:px-[clamp(20px,5vw,32px)] md:pb-[72px] md:pt-[56px]">
        <div className="mx-auto grid max-w-container items-start gap-[20px] md:gap-[24px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <GetStartedPanel
            headline="Ready to get started?"
            sub="Submit an inquiry and we'll match you with a tutor within 24h."
          />
          {/* A bordered card on mobile; plain column from md up. */}
          <div className="max-w-[520px] rounded-[16px] border border-border bg-white p-[20px] md:self-center md:rounded-none md:border-0 md:p-0">
            <h2 className="text-17 font-extrabold tracking-[-0.01em] md:text-d28">
              Questions before you start?
            </h2>
            <p className="mt-[8px] text-13 leading-[1.7] text-muted [text-wrap:pretty] md:mt-[16px] md:text-16 md:leading-[26px]">
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
