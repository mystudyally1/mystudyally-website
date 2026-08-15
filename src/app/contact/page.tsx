import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { InquiryFormLazy } from "@/components/forms/InquiryFormLazy";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_LINK,
  SLA_RESPONSE_TIME,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what your child needs and we'll match them with a tutor. Every inquiry is read by a person — we reply within 24 hours.",
};

const DETAILS = [
  { label: "EMAIL", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "WHATSAPP", value: CONTACT_WHATSAPP_DISPLAY, href: CONTACT_WHATSAPP_LINK },
  { label: "RESPONSE", value: `${SLA_RESPONSE_TIME.replace(/^within /, "Within ")}, every day` },
  { label: "OFFICES", value: CONTACT_ADDRESS },
];

const FAQS = [
  {
    question: "How much does tutoring cost?",
    answer: (
      <>
        You buy a prepaid package of hours, and hours are deducted as sessions happen. Full rates
        are on the <a href="/pricing/">pricing page</a>.
      </>
    ),
  },
  {
    question: "How does matching work?",
    answer: "You tell us the curriculum and subjects; our team hand-picks a tutor who specialises in that exact exam board.",
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes — a 30-minute trial session, no card required.",
  },
  {
    question: "Which curricula do you cover?",
    answer:
      "IGCSE, GCSE, A Levels, IB, SABIS, HKDSE, and the American and Canadian curricula — plus IELTS and SAT preparation.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Section className="pb-2 pt-14">
        <Container className="max-w-2xl">
          <div className="text-eyebrow text-muted">CONTACT</div>
          <h1 className="mt-4 text-d-4xl text-ink">Get in touch</h1>
          <p className="mt-4 text-lg text-muted">
            Tell us what your child needs and we&rsquo;ll match them with a tutor. Or ask us
            anything first — same team either way.
          </p>
          <p className="mt-5 text-sm font-bold text-ink">
            Every inquiry is read by a person, not routed to a queue. We reply {SLA_RESPONSE_TIME}.
          </p>
        </Container>
      </Section>

      <Section className="pt-8">
        <Container className="grid items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-20">
          <Card>
            <InquiryFormLazy variant="full" />
          </Card>

          <div className="flex flex-col">
            {DETAILS.map((d) => (
              <div
                key={d.label}
                className="grid grid-cols-[90px_1fr] gap-5 border-t border-border py-4 first:pt-0"
              >
                <span className="pt-0.5 text-xs font-bold tracking-wide text-muted-3">
                  {d.label}
                </span>
                {d.href ? (
                  <a href={d.href} className="text-sm font-bold text-ink underline decoration-border underline-offset-4 hover:decoration-ink">
                    {d.value}
                  </a>
                ) : (
                  <span className="text-sm leading-relaxed text-ink">{d.value}</span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <div className="text-eyebrow text-muted">BEFORE YOU WRITE IN</div>
          <h2 className="mt-3.5 text-d-lg text-ink">Quick answers</h2>
          <Accordion items={FAQS} className="mt-4" />
          <a href="/faq/" className="mt-6 inline-block border-b-2 border-primary pb-0.5 text-sm font-bold text-ink">
            Read the full FAQ →
          </a>
        </Container>
      </Section>
    </>
  );
}
