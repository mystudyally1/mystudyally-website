import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/marketing/CtaBand";
import { SubjectIcon } from "@/components/marketing/SubjectIcon";
import { CURRICULA } from "@/data/curricula";
import { SITE_URL, SLA_RESPONSE_TIME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Subjects & Curricula",
  description:
    "Every curriculum and subject MyStudyAlly covers — IGCSE, GCSE, A Levels, IB, SABIS, HKDSE, American and Canadian curricula, plus IELTS and SAT preparation.",
  alternates: { canonical: `${SITE_URL}/subjects/` },
};

export default function SubjectsPage() {
  return (
    <>
      <Section className="pb-6 pt-14">
        <Container className="max-w-3xl">
          <div className="text-eyebrow text-muted">SUBJECTS</div>
          <h1 className="mt-4 text-d-4xl text-ink">Every curriculum we cover</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Ten curricula and the subjects within them. If yours isn&rsquo;t listed, tell us
            anyway — our tutor network is wider than what&rsquo;s published here.
          </p>
        </Container>
      </Section>

      <Section className="pt-4">
        <Container>
          <div className="flex flex-col gap-10">
            {CURRICULA.map((c) => (
              <div key={c.slug} className="border-t border-border pt-8">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <h2 className="text-d-md text-ink">
                      <Link href={`/${c.slug}/`} className="text-ink hover:text-link">
                        {c.name}
                      </Link>
                    </h2>
                    <p className="mt-1.5 text-md text-muted">{c.tagline}</p>
                  </div>
                  <Link
                    href={`/${c.slug}/`}
                    className="border-b-2 border-primary pb-0.5 text-sm font-bold text-ink"
                  >
                    View {c.shortName} tutoring →
                  </Link>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {c.subjects.map((s) => (
                    <Link
                      key={s}
                      href={`/${c.slug}/`}
                      className="flex items-center gap-2.5 rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-link-light-2 hover:shadow-card"
                    >
                      <SubjectIcon name={s} className="shrink-0 text-link" />
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <CtaBand
            headline="Don't see your subject?"
            sub={`Tell us what you need — we'll reply ${SLA_RESPONSE_TIME}.`}
          />
        </Container>
      </Section>
    </>
  );
}
