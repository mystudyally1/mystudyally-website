import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/marketing/CtaBand";
import { TutorGrid } from "@/components/marketing/TutorGrid";
import { SITE_URL, SLA_RESPONSE_TIME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Tutors",
  description:
    "Meet the vetted, curriculum-matched tutors behind MyStudyAlly — specialists in IGCSE, GCSE, A Levels, IB, SABIS, HKDSE, and more.",
  alternates: { canonical: `${SITE_URL}/tutors/` },
};

export default function TutorsPage() {
  return (
    <>
      <Section className="pb-6 pt-14">
        <Container className="max-w-3xl">
          <div className="text-eyebrow text-muted">OUR TUTORS</div>
          <h1 className="mt-4 text-d-4xl text-ink">
            Specialists in your exam board, not generalists
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Every tutor is vetted for the specific curriculum and subjects they teach. You
            don&rsquo;t browse profiles — tell us what you need and our team matches you.
          </p>
        </Container>
      </Section>

      <Section className="pt-4">
        <Container>
          <TutorGrid />
        </Container>
      </Section>

      <Section>
        <Container>
          <CtaBand
            headline="Not sure who's the right fit?"
            sub={`Tell us the curriculum and subjects — we'll match you and reply ${SLA_RESPONSE_TIME}.`}
          />
        </Container>
      </Section>
    </>
  );
}
