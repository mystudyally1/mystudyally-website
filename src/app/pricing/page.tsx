import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/marketing/CtaBand";
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
  VALIDITY_LINES,
} from "@/data/pricing";
import { SITE_URL, SLA_RESPONSE_TIME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Six prepaid plans from 4 to 32 classes, starting at $45. No registration or platform fees — the plan price is all you pay. Every plan starts with a free trial.",
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

      <Section className="pb-6 pt-14">
        <Container className="max-w-3xl">
          <div className="text-eyebrow text-muted">PRICING</div>
          <h1 className="mt-4 text-d-4xl text-ink">Prepaid classes. No hidden fees.</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Buy a plan of classes and use them as sessions happen. Every class is{" "}
            {CLASS_DURATION_MINUTES} minutes, one-to-one, and recorded — on every plan.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {PRICING_TRUST.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-pill bg-primary-light px-4 py-2 text-xs font-bold text-primary-shadow"
              >
                <span className="font-extrabold">✓</span>
                {t}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* Plans, grouped */}
      {PLAN_GROUPS.map((group, gi) => (
        <Section key={group.label} className="py-8">
          <Container>
            <div className="mb-6 max-w-2xl">
              <div className="text-eyebrow text-muted-3">{group.label}</div>
              <p className="mt-2 text-md text-muted">{group.desc}</p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {PLANS.filter((p) => p.group === gi).map((plan) => {
                const highlighted = plan.name === HIGHLIGHT_PLAN;
                return (
                  <div
                    key={plan.name}
                    className={cn(
                      "relative flex flex-col rounded-xl border-2 p-7",
                      highlighted
                        ? "border-link-hover bg-link text-white shadow-[0_14px_32px_rgba(28,176,246,0.35)]"
                        : "border-border bg-white shadow-card",
                    )}
                  >
                    {highlighted && (
                      <span className="absolute -top-3 right-6 rounded-pill bg-white px-3 py-1 text-[10px] font-extrabold tracking-wide text-link-hover">
                        RECOMMENDED
                      </span>
                    )}
                    <div
                      className={cn(
                        "text-eyebrow",
                        highlighted ? "text-link-light" : "text-muted-3",
                      )}
                    >
                      {plan.tier}
                    </div>
                    <div
                      className={cn(
                        "mt-2 text-d-lg",
                        highlighted ? "text-white" : "text-ink",
                      )}
                    >
                      {plan.price}{" "}
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          highlighted ? "text-white/75" : "text-muted",
                        )}
                      >
                        USD
                      </span>
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-md font-bold",
                        highlighted ? "text-white" : "text-primary-shadow",
                      )}
                    >
                      {plan.classes} classes
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-sm font-semibold",
                        highlighted ? "text-white/75" : "text-muted-3",
                      )}
                    >
                      {plan.per} · {plan.validity}
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-sm",
                        highlighted ? "text-white/75" : "text-muted-3",
                      )}
                    >
                      {plan.cadence}
                    </div>

                    <div
                      className={cn(
                        "my-5 border-t",
                        highlighted ? "border-white/30" : "border-border",
                      )}
                    />

                    {plan.intro && (
                      <div
                        className={cn(
                          "mb-2.5 text-xs font-semibold",
                          highlighted ? "text-link-light" : "text-muted-3",
                        )}
                      >
                        {plan.intro}
                      </div>
                    )}
                    <ul className="flex flex-1 flex-col gap-2">
                      {plan.feats.map((f) => (
                        <li
                          key={f}
                          className={cn(
                            "flex items-start gap-2.5 text-sm",
                            highlighted ? "text-white/95" : "text-muted",
                          )}
                        >
                          <span
                            className={cn(
                              "font-extrabold",
                              highlighted ? "text-[#FFC800]" : "text-primary",
                            )}
                          >
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Button
                      as={Link}
                      href="/contact/"
                      variant={highlighted ? "white" : "primary"}
                      className="mt-6"
                    >
                      Submit an inquiry
                    </Button>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>
      ))}

      {/* Validity */}
      <Section className="py-8">
        <Container className="max-w-3xl">
          <div className="rounded-xl border border-border bg-surface-alt p-6">
            <h2 className="text-d-sm text-ink">Plan validity</h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {VALIDITY_LINES.map((l) => (
                <li key={l} className="text-sm text-muted">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Comparison table */}
      <Section className="my-6 bg-surface-alt">
        <Container>
          <h2 className="mb-8 text-d-md text-ink">What each plan includes</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-surface-alt p-3 text-eyebrow text-muted-3">
                    Included
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.name}
                      className={cn(
                        "rounded-t-md p-3 text-center",
                        p.name === HIGHLIGHT_PLAN ? "bg-[#EAF7FE] text-link-hover" : "bg-white text-ink",
                      )}
                    >
                      <div className="text-sm font-bold">{p.name}</div>
                      <div className="text-xs font-semibold text-muted">
                        {p.classes} cls · {p.price}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_BENEFITS.map(([name, min]) => (
                  <tr key={name} className="border-t border-border">
                    <td className="sticky left-0 bg-surface-alt p-3 text-sm font-semibold text-ink">
                      {name}
                    </td>
                    {PLANS.map((p) => {
                      const included = p.classes >= min;
                      return (
                        <td
                          key={p.name}
                          className={cn(
                            "p-3 text-center text-md font-bold",
                            p.name === HIGHLIGHT_PLAN ? "bg-[#F4FBFF]" : "bg-white",
                            included ? "text-primary" : "text-[#DEDEDE]",
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
        </Container>
      </Section>

      {/* How enrolment works */}
      <Section>
        <Container>
          <h2 className="mb-9 text-d-md text-ink">How enrolment works</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ENROLMENT_STEPS.map((s) => (
              <div key={s.n} className="flex flex-col gap-3 border-t-2 border-border pt-5">
                <span className="text-eyebrow text-muted-3">STEP {s.n}</span>
                <h3 className="text-lg font-bold text-ink">{s.t}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ + CTA */}
      <Section>
        <Container className="grid items-start gap-6 lg:grid-cols-2">
          <CtaBand
            headline="Start with a free trial"
            sub={`No card required. Submit an inquiry and we'll reply ${SLA_RESPONSE_TIME}.`}
          />
          <div>
            <h2 className="mb-5 text-d-md text-ink">Pricing questions</h2>
            <FaqList items={PRICING_FAQS} />
          </div>
        </Container>
      </Section>
    </>
  );
}
