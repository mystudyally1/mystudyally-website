import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/ui/FaqList";
import { GetStartedPanel } from "@/components/marketing/GetStartedPanel";
import { PlanFinder } from "@/components/marketing/PlanFinder";
import { cn } from "@/lib/cn";
import { SnapRail } from "@/components/marketing/SnapRail";
import {
  CLASS_DURATION_MINUTES,
  ENROLMENT_STEPS,
  HIGHLIGHT_PLAN,
  PLANS,
  PLAN_BENEFITS,
  PLAN_GROUPS,
  PRICING_FAQS,
  PRICING_TRUST,
  ROLLOVER_NOTE,
  VALIDITY_LINES,
} from "@/data/pricing";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION_ID, abs, breadcrumbJsonLd, homeCrumb, webPageJsonLd } from "@/lib/seo";
import { pageSocial } from "@/lib/metadata";

const TITLE = "Tutoring Prices — Plans from $45";
const DESCRIPTION =
  "Affordable 1-to-1 tutoring with flexible scheduling, specialist tutors and personalised academic support. Six plans from 4 to 32 classes, starting from just $45.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/pricing/` },
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/pricing/" }),
};

const CRUMBS = [homeCrumb, { name: "Pricing", path: "/pricing/" }];

/** "$135" -> 135. The plan data stores prices as display strings. */
const toNumber = (price: string) => Number(price.replace(/[^0-9.]/g, ""));

export default function PricingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${abs("/pricing/")}#faq`,
    mainEntity: PRICING_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Every plan as a real Offer. This is what makes the price eligible to
  // appear in the result rather than only in the page body — and it is built
  // from PLANS, so a price change in the data updates the markup with it.
  // `priceValidUntil` is required by Google for an Offer; it is set a year out
  // and is a "believe this price until" hint, not a promise the plan ends.
  const priceValidUntil = `${new Date().getUTCFullYear() + 1}-12-31`;
  const offers = PLANS.map((plan) => ({
    "@type": "Offer",
    "@id": `${abs("/pricing/")}#plan-${plan.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `${plan.name} — ${plan.classes} classes`,
    description: `${plan.classes} one-to-one classes of ${CLASS_DURATION_MINUTES} minutes. ${plan.per}. ${plan.validity}.`,
    price: toNumber(plan.price),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: abs("/pricing/"),
    priceValidUntil,
    category: plan.tier,
    seller: { "@id": ORGANIZATION_ID },
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      value: plan.classes,
      unitText: "classes",
    },
  }));

  const prices = PLANS.map((p) => toNumber(p.price));

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs("/pricing/")}#service`,
    name: "Online 1-to-1 tutoring plans",
    serviceType: "Online tutoring",
    description: DESCRIPTION,
    provider: { "@id": ORGANIZATION_ID },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: PLANS.length,
      offers,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${SITE_NAME} tutoring plans`,
      itemListElement: PLANS.map((plan, i) => ({
        "@type": "OfferCatalog",
        position: i + 1,
        name: plan.name,
        itemListElement: plan.feats.map((f) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: f },
        })),
      })),
    },
  };

  return (
    <>
      <JsonLd
        nodes={[
          webPageJsonLd({
            title: TITLE,
            description: DESCRIPTION,
            path: "/pricing/",
            crumbs: CRUMBS,
          }),
          breadcrumbJsonLd(CRUMBS),
          serviceJsonLd,
          faqJsonLd,
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-[20px] pb-[24px] pt-[40px] text-center md:px-[clamp(20px,5vw,32px)] md:pb-[36px] md:pt-[72px] md:text-left">
        <div
          className="pointer-events-none absolute hidden md:block -right-[160px] -top-[120px] h-[560px] w-[560px] blur-[24px]"
          style={{
            background: "radial-gradient(circle, rgba(88,204,2,0.14), rgba(88,204,2,0) 65%)",
          }}
        />
        <div className="relative mx-auto max-w-[860px] text-center">
          <span className="inline-block rounded-pill border border-link-light-3 bg-link-light/90 px-[12px] py-[5px] text-10 font-bold tracking-[0.12em] text-link-hover md:px-[14px] md:py-[6px] md:text-11">
            PRICING
          </span>
          <h1 className="mt-[14px] text-28 font-extrabold tracking-[-0.01em] [text-wrap:balance] md:mt-[18px] md:text-d46 md:tracking-[-0.02em]">
            Choose the Support That Fits Your Goals
          </h1>
          <p className="mx-auto mt-[12px] max-w-[620px] text-13_5 leading-[1.65] text-muted md:mt-[16px] md:text-15_5 md:leading-[1.7]">
            Affordable 1-to-1 tutoring with flexible scheduling, specialist tutors and personalised
            academic support. Starting from just $45.
          </p>
          <div className="mt-[16px] flex flex-wrap justify-center gap-x-[16px] gap-y-[8px] md:mt-[22px] md:gap-[22px]">
            {PRICING_TRUST.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-[6px] text-11_5 font-bold text-muted md:gap-[7px] md:text-13"
              >
                <span className="font-extrabold text-primary">✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Free trial banner */}
      <section className="px-[16px] pb-[8px] pt-[4px] md:px-[clamp(20px,5vw,32px)] md:pt-[16px]">
        {/* Mobile centres the whole banner and drops the icon; desktop keeps
            the icon + text on the left with the button on the right. */}
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-[12px] rounded-[14px] border border-dashed border-[#CFCFCF] bg-surface-alt p-[18px] text-center md:flex-row md:flex-wrap md:justify-between md:gap-[28px] md:rounded-[16px] md:px-[28px] md:py-[22px] md:text-left">
          <div className="flex items-center gap-[18px]">
            <span className="hidden h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-link-light text-18 font-extrabold text-link md:inline-flex">
              ☆
            </span>
            <div>
              <div className="text-15 font-extrabold md:text-17">
                Not sure yet? Start with a free trial session.
              </div>
              <p className="mt-[6px] text-12 leading-[1.6] text-muted md:mt-[4px] md:text-13">
                30 minutes, no payment required, no card. Submit an inquiry and we&#39;ll match you
                with a tutor before you commit.
              </p>
            </div>
          </div>
          <Link
            href="/contact/"
            className="shrink-0 whitespace-nowrap rounded-[12px] border-2 border-primary bg-white px-[20px] py-[10px] text-12 font-extrabold tracking-[0.03em] text-primary-shadow hover:bg-[#F3FBEA] hover:text-primary-shadow md:rounded-[14px] md:px-[22px] md:py-[11px] md:text-13"
          >
            Submit an inquiry
          </Link>
        </div>
      </section>

      {/* Plans heading */}
      <section className="px-[16px] pb-0 pt-[24px] text-center md:px-[clamp(20px,5vw,32px)] md:pt-[44px] md:text-left">
        <div className="mx-auto max-w-[1080px] text-center">
          <h2 className="text-21 font-extrabold md:text-d30">Six plans, one simple ladder</h2>
          <p className="mt-[10px] text-11_5 font-bold text-muted md:mt-[12px] md:text-13_5">
            Every class is{" "}
            <span className="font-extrabold text-[#1A1A1A]">{CLASS_DURATION_MINUTES} minutes</span>{" "}
            — same length on every plan.
          </p>
        </div>
      </section>

      {/* Plan grid */}
      <section className="pb-[28px] pt-[16px] md:px-[clamp(20px,5vw,32px)] md:pb-[48px] md:pt-[28px]">
        <div className="mx-auto max-w-[1360px]">
          {/* The mobile design carries the group label as a chip inside each
              card instead of this header row. */}
          <div className="mb-[14px] hidden gap-[16px] md:grid md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {PLAN_GROUPS.map((g) => (
              <div
                key={g.label}
                className="rounded-[12px] border border-[#ECECEC] bg-surface-alt px-[16px] py-[10px] text-center"
              >
                <div className="text-12 font-extrabold tracking-[0.14em] text-primary-shadow">
                  {g.label}
                </div>
                <div className="mt-[2px] text-11_5 text-[#999999]">{g.desc}</div>
              </div>
            ))}
          </div>

          <SnapRail
            count={PLANS.length}
            cardStep={304}
            railClass="gap-[12px] px-[44px] pb-[8px] pt-[16px] md:gap-[16px] md:px-0 md:pb-0 md:pt-[14px]"
            gridClass="md:items-stretch md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]"
          >
            {PLANS.map((plan) => {
              const hi = plan.name === HIGHLIGHT_PLAN;
              return (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex w-[292px] shrink-0 snap-center flex-col rounded-[16px] border p-[20px] md:w-auto md:shrink md:px-[16px]",
                    hi
                      ? "border-link-hover bg-link shadow-[0_14px_32px_rgba(28,176,246,0.35)] md:-translate-y-[12px] md:py-[26px]"
                      : "border-border bg-white shadow-[0_2px_8px_rgba(60,60,60,0.06)] md:py-[20px]",
                  )}
                >
                  {hi && (
                    <span className="absolute -top-[11px] right-[16px] whitespace-nowrap rounded-pill bg-[#FFC800] px-[12px] py-[4px] text-10 font-extrabold tracking-[0.08em] text-[#7A5B00] shadow-[0_4px_12px_rgba(255,200,0,0.4)] md:-top-[13px] md:left-1/2 md:right-auto md:-translate-x-1/2">
                      RECOMMENDED
                    </span>
                  )}
                  {/* Mobile-only group chip, replacing the header row above. */}
                  <span
                    className={cn(
                      "self-start rounded-pill px-[10px] py-[3px] text-9_5 font-extrabold tracking-[0.12em] md:hidden",
                      hi ? "bg-white/20 text-white" : "bg-surface-alt text-primary-shadow",
                    )}
                  >
                    {PLAN_GROUPS[plan.group]?.label}
                  </span>
                  <div
                    className={cn(
                      "mt-[12px] text-11 font-extrabold tracking-[0.12em] md:mt-0",
                      hi ? "text-link-light" : "text-muted-3",
                    )}
                  >
                    {plan.tier}
                  </div>
                  <div
                    className={cn(
                      "mt-[10px] text-d30 font-black leading-none tracking-[-0.02em]",
                      hi ? "text-white" : "text-body",
                    )}
                  >
                    {plan.price}
                  </div>
                  <div
                    className={cn(
                      "mt-[7px] text-13_5 font-extrabold",
                      hi ? "text-white" : "text-primary-shadow",
                    )}
                  >
                    {plan.classes} classes
                  </div>
                  <div
                    className={cn(
                      "mt-[5px] text-11 font-semibold",
                      hi ? "text-white/75" : "text-muted-3",
                    )}
                  >
                    {plan.per}
                  </div>
                  <div
                    className={cn(
                      "mt-[2px] text-10_5 font-semibold",
                      hi ? "text-white/75" : "text-muted-3",
                    )}
                  >
                    {plan.validity}
                    <br />
                    {plan.cadence}
                  </div>
                  <div
                    className={cn("my-[12px] mb-[10px] h-px", hi ? "bg-white/30" : "bg-[#F0F0F0]")}
                  />
                  {plan.intro && (
                    <div
                      className={cn(
                        "mb-[7px] text-10_5 font-extrabold",
                        hi ? "text-link-light" : "text-[#999999]",
                      )}
                    >
                      {plan.intro}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-[6px]">
                    {plan.feats.map((f) => (
                      <div key={f} className="flex items-baseline gap-[7px]">
                        <span
                          className={cn(
                            "shrink-0 text-10 font-extrabold",
                            hi ? "text-[#FFC800]" : "text-primary",
                          )}
                        >
                          ✓
                        </span>
                        <span
                          className={cn(
                            "text-11_5 leading-[1.45]",
                            hi ? "text-[#F2FBFF]" : "text-[#666666]",
                          )}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/contact/"
                    className={cn(
                      "mt-[14px] rounded-[12px] px-[6px] py-[10px] text-center text-11 font-extrabold tracking-[0.02em] hover:opacity-90",
                      hi
                        ? "bg-white text-link-hover shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:text-link-hover"
                        : "bg-primary text-white shadow-[0_4px_0_#58A700] hover:text-white",
                    )}
                  >
                    Submit an inquiry
                  </Link>
                </div>
              );
            })}
          </SnapRail>
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-[16px] pb-[32px] pt-[8px] md:px-[clamp(20px,5vw,32px)] md:pb-[56px] md:pt-[24px]">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="mb-[24px] text-center text-d26 font-extrabold">Compare every plan</h2>
          <div className="overflow-x-auto rounded-[16px] border border-border shadow-[0_2px_6px_rgba(60,60,60,0.05)]">
            <table className="w-full min-w-[760px] border-collapse text-13">
              <thead>
                <tr>
                  <th className="border-b border-border bg-surface-alt px-[18px] py-[14px] text-left text-12 font-extrabold tracking-[0.06em] text-muted">
                    BENEFIT
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.name}
                      className={cn(
                        "border-b border-border px-[8px] py-[14px] text-center",
                        p.name === HIGHLIGHT_PLAN ? "bg-[#EAF7FE]" : "bg-white",
                      )}
                    >
                      <div
                        className={cn(
                          "text-12 font-extrabold",
                          p.name === HIGHLIGHT_PLAN ? "text-link-hover" : "text-body",
                        )}
                      >
                        {p.name}
                      </div>
                      <div className="text-10_5 font-semibold text-muted-3">
                        {p.classes} cls · {p.price}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_BENEFITS.map(([name, min]) => (
                  <tr key={name} className="border-b border-[#F0F0F0]">
                    <td className="px-[18px] py-[11px] font-bold text-[#555555]">{name}</td>
                    {PLANS.map((p) => {
                      const included = p.classes >= min;
                      return (
                        <td
                          key={p.name}
                          className={cn(
                            "px-[8px] py-[11px] text-center font-extrabold",
                            p.name === HIGHLIGHT_PLAN ? "bg-[#F4FBFF]" : "",
                            included ? "text-primary text-14" : "text-[#DEDEDE] text-13",
                          )}
                        >
                          {included ? "✓" : "–"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Validity & rollover */}
      <section className="px-[16px] pb-[32px] pt-0 md:px-[clamp(20px,5vw,32px)] md:pb-[56px]">
        <div className="mx-auto max-w-[820px] rounded-[16px] border border-border bg-white px-[36px] py-[30px] shadow-[0_2px_6px_rgba(60,60,60,0.05)]">
          <h2 className="mb-[14px] text-20 font-extrabold">Validity &amp; rollover</h2>
          <div className="flex flex-col gap-[7px]">
            {VALIDITY_LINES.map((v) => (
              <div key={v} className="flex items-baseline gap-[10px]">
                <span className="text-12 font-extrabold text-primary">✓</span>
                <span className="text-14 font-semibold text-[#555555]">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-[14px] border-t border-[#F0F0F0] pt-[14px] text-13 leading-[1.7] text-muted">
            <strong className="text-body">Rollover:</strong> {ROLLOVER_NOTE}
          </p>
        </div>
      </section>

      {/* How enrolment works */}
      <section className="px-[16px] pb-[32px] pt-0 md:px-[clamp(20px,5vw,32px)] md:pb-[56px]">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="mb-[16px] text-center text-20 font-extrabold md:mb-[28px] md:text-d26">
            How enrolment works
          </h2>
          {/* Mobile puts the number beside the text in a short card; desktop
              stacks it above in a wider one. */}
          <div className="flex flex-col gap-[10px] md:grid md:gap-[18px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
            {ENROLMENT_STEPS.map((s) => (
              <div
                key={s.n}
                className="flex items-start gap-[14px] rounded-[14px] border border-border bg-white p-[16px] md:block md:rounded-[16px] md:px-[22px] md:py-[24px] md:shadow-[0_2px_6px_rgba(60,60,60,0.05)]"
              >
                <span className="inline-flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-pill bg-link-light text-12 font-extrabold text-link-hover md:h-[32px] md:w-[32px] md:text-14">
                  {s.n}
                </span>
                <div>
                  <div className="text-13 font-extrabold md:mb-[6px] md:mt-[12px] md:text-14_5">
                    {s.t}
                  </div>
                  <p className="mt-[3px] text-11_5 leading-[1.55] text-muted md:mt-0 md:text-12_5 md:leading-[1.6]">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find your plan — id is deep-linked from the chat assistant */}
      <section
        id="find-your-plan"
        className="scroll-mt-[80px] px-[16px] pb-[32px] pt-0 md:px-[clamp(20px,5vw,32px)] md:pb-[56px]"
      >
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <h2 className="text-20 font-extrabold md:text-d26">Find your plan</h2>
            <p className="mt-[8px] text-11_5 text-muted md:mt-[10px] md:text-13">
              Answer three quick questions — we&#39;ll point you at the right plan.
            </p>
          </div>
          <PlanFinder />
          <p className="mx-auto mt-[16px] max-w-[560px] text-center text-10_5 leading-[1.6] text-muted-3 md:mt-[28px] md:text-11_5">
            This is a starting point, not a commitment. Our team confirms your schedule and tutor
            before any payment — tell us what you need and we&#39;ll sanity-check the plan with you.
          </p>
        </div>
      </section>

      {/* Get started + FAQ */}
      <section id="faq" className="px-[16px] pb-[32px] pt-0 md:px-[clamp(20px,5vw,32px)] md:pb-[72px]">
        <div className="mx-auto grid max-w-container items-start gap-[24px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <GetStartedPanel
            headline="Ready to get started?"
            sub="Submit an inquiry and we'll match you with a tutor within 24h."
          />
          <div>
            <h2 className="mb-[20px] text-d28 font-extrabold tracking-[-0.01em]">
              Questions parents ask
            </h2>
            <FaqList items={PRICING_FAQS} defaultOpen={-1} />
          </div>
        </div>
      </section>
    </>
  );
}
