import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/ui/FaqList";
import { GetStartedPanel } from "@/components/marketing/GetStartedPanel";
import { PlanFinder } from "@/components/marketing/PlanFinder";
import { cn } from "@/lib/cn";
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
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Affordable 1-to-1 tutoring with flexible scheduling, specialist tutors and personalised academic support. Six plans from 4 to 32 classes, starting from just $45.",
  alternates: { canonical: `${SITE_URL}/pricing/` },
};

export default function PricingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-[clamp(20px,5vw,32px)] pb-[36px] pt-[72px]">
        <div
          className="pointer-events-none absolute hidden md:block -right-[160px] -top-[120px] h-[560px] w-[560px] blur-[24px]"
          style={{
            background: "radial-gradient(circle, rgba(88,204,2,0.14), rgba(88,204,2,0) 65%)",
          }}
        />
        <div className="relative mx-auto max-w-[860px] text-center">
          <span className="inline-block rounded-pill border border-link-light-3 bg-link-light/90 px-[14px] py-[6px] text-11 font-bold tracking-[0.12em] text-link-hover">
            PRICING
          </span>
          <h1 className="mt-[18px] text-d46 font-extrabold tracking-[-0.02em] [text-wrap:balance]">
            Choose the Support That Fits Your Goals
          </h1>
          <p className="mx-auto mt-[16px] max-w-[620px] text-15_5 leading-[1.7] text-muted">
            Affordable 1-to-1 tutoring with flexible scheduling, specialist tutors and personalised
            academic support. Starting from just $45.
          </p>
          <div className="mt-[22px] flex flex-wrap justify-center gap-[22px]">
            {PRICING_TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-[7px] text-13 font-bold text-muted">
                <span className="font-extrabold text-primary">✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Free trial banner */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[8px] pt-[16px]">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-[28px] rounded-[16px] border border-dashed border-[#CFCFCF] bg-surface-alt px-[28px] py-[22px]">
          <div className="flex items-center gap-[18px]">
            <span className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-link-light text-18 font-extrabold text-link">
              ☆
            </span>
            <div>
              <div className="text-17 font-extrabold">
                Not sure yet? Start with a free trial session.
              </div>
              <p className="mt-[4px] text-13 leading-[1.6] text-muted">
                30 minutes, no payment required, no card. Submit an inquiry and we&#39;ll match you
                with a tutor before you commit.
              </p>
            </div>
          </div>
          <Link
            href="/contact/"
            className="shrink-0 whitespace-nowrap rounded-[14px] border-2 border-primary bg-white px-[22px] py-[11px] text-13 font-extrabold tracking-[0.03em] text-primary-shadow hover:bg-[#F3FBEA] hover:text-primary-shadow"
          >
            Submit an inquiry
          </Link>
        </div>
      </section>

      {/* Plans heading */}
      <section className="px-[clamp(20px,5vw,32px)] pb-0 pt-[44px]">
        <div className="mx-auto max-w-[1080px] text-center">
          <h2 className="text-d30 font-extrabold">Six plans, one simple ladder</h2>
          <p className="mt-[12px] text-13_5 font-bold text-muted">
            Every class is{" "}
            <span className="font-extrabold text-[#1A1A1A]">{CLASS_DURATION_MINUTES} minutes</span>{" "}
            — same length on every plan.
          </p>
        </div>
      </section>

      {/* Plan grid */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[48px] pt-[28px]">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-[14px] grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
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

          <div className="grid items-stretch gap-[16px] pt-[14px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
            {PLANS.map((plan) => {
              const hi = plan.name === HIGHLIGHT_PLAN;
              return (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col rounded-[16px] border",
                    hi
                      ? "-translate-y-[12px] border-link-hover bg-link px-[16px] py-[26px] shadow-[0_14px_32px_rgba(28,176,246,0.35)]"
                      : "border-border bg-white px-[16px] py-[20px] shadow-[0_2px_8px_rgba(60,60,60,0.06)]",
                  )}
                >
                  {hi && (
                    <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-[#FFC800] px-[12px] py-[4px] text-10 font-extrabold tracking-[0.08em] text-[#7A5B00] shadow-[0_4px_12px_rgba(255,200,0,0.4)]">
                      RECOMMENDED
                    </span>
                  )}
                  <div
                    className={cn(
                      "text-11 font-extrabold tracking-[0.12em]",
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
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[56px] pt-[24px]">
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
      <section className="px-[clamp(20px,5vw,32px)] pb-[56px] pt-0">
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
      <section className="px-[clamp(20px,5vw,32px)] pb-[56px] pt-0">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="mb-[28px] text-center text-d26 font-extrabold">How enrolment works</h2>
          <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
            {ENROLMENT_STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-[16px] border border-border bg-white px-[22px] py-[24px] shadow-[0_2px_6px_rgba(60,60,60,0.05)]"
              >
                <span className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-pill bg-link-light text-14 font-extrabold text-link-hover">
                  {s.n}
                </span>
                <div className="mb-[6px] mt-[12px] text-14_5 font-extrabold">{s.t}</div>
                <p className="text-12_5 leading-[1.6] text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find your plan — id is deep-linked from the chat assistant */}
      <section
        id="find-your-plan"
        className="scroll-mt-[80px] px-[clamp(20px,5vw,32px)] pb-[56px] pt-0"
      >
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <h2 className="text-d26 font-extrabold">Find your plan</h2>
            <p className="mt-[10px] text-13 text-muted">
              Answer three quick questions — we&#39;ll point you at the right plan.
            </p>
          </div>
          <PlanFinder />
          <p className="mx-auto mt-[28px] max-w-[560px] text-center text-11_5 leading-[1.6] text-muted-3">
            This is a starting point, not a commitment. Our team confirms your schedule and tutor
            before any payment — tell us what you need and we&#39;ll sanity-check the plan with you.
          </p>
        </div>
      </section>

      {/* Get started + FAQ */}
      <section id="faq" className="px-[clamp(20px,5vw,32px)] pb-[72px] pt-0">
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
