import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/marketing/CtaBand";
import { FaqBrowser } from "@/components/marketing/FaqBrowser";
import { FAQ_GROUPS } from "@/data/faqs";
import { SITE_URL, SLA_RESPONSE_TIME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers on matching, pricing and payments, scheduling, tutors, and account access — everything families ask before starting with MyStudyAlly.",
  alternates: { canonical: `${SITE_URL}/faq/` },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Section className="pb-6 pt-14">
        <Container className="max-w-3xl">
          <div className="text-eyebrow text-muted">FAQ</div>
          <h1 className="mt-4 text-d-4xl text-ink">Questions, answered</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Matching, pricing, scheduling, tutors, and accounts. If something isn&rsquo;t here,
            ask us — we reply {SLA_RESPONSE_TIME}.
          </p>
        </Container>
      </Section>

      <Section className="pt-4">
        <Container>
          <FaqBrowser />
        </Container>
      </Section>

      <Section>
        <Container>
          <CtaBand
            headline="Still have a question?"
            sub={`Ask us directly — every inquiry is read by a person and answered ${SLA_RESPONSE_TIME}.`}
            ctaLabel="Ask us a question"
          />
        </Container>
      </Section>
    </>
  );
}
