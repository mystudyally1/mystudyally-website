import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ABOUT_FAQS, ABOUT_ROWS, VETTING_STEPS } from "@/data/about";
import { CONTACT_ADDRESS, SITE_URL, SLA_RESPONSE_TIME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MyStudyAlly is managed tutoring, not a marketplace. Our team vets every tutor, handles scheduling, and matches students to specialists in their exact exam board.",
  alternates: { canonical: `${SITE_URL}/about/` },
};

export default function AboutPage() {
  return (
    <>
      <Section className="pb-6 pt-14">
        <Container className="max-w-3xl">
          <div className="text-eyebrow text-muted">ABOUT US</div>
          <h1 className="mt-4 text-d-4xl text-ink">Managed tutoring, done properly.</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            We&rsquo;re not a marketplace that hands you a directory and wishes you luck. Our team
            matches every student personally, vets every tutor against the specification they
            teach, and handles the logistics so families don&rsquo;t have to.
          </p>
        </Container>
      </Section>

      {/* What makes it different */}
      <Section className="py-10">
        <Container className="max-w-4xl">
          <div className="flex flex-col">
            {ABOUT_ROWS.map((r) => (
              <div
                key={r.num}
                className="grid grid-cols-[44px_1fr] gap-6 border-t border-border py-7 sm:grid-cols-[44px_1fr_1fr]"
              >
                <span className="text-2xl font-extrabold text-muted-3">{r.num}</span>
                <h2 className="text-lg font-bold text-ink">{r.title}</h2>
                <p className="text-md leading-relaxed text-muted sm:col-start-3">{r.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Vetting */}
      <Section className="my-6 bg-surface-dark">
        <Container>
          <div className="mb-11 max-w-xl">
            <div className="mb-3.5 text-eyebrow text-muted-2">HOW WE VET TUTORS</div>
            <h2 className="text-d-lg text-white">
              Every tutor clears four steps{" "}
              <span className="text-muted-2">before they teach.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VETTING_STEPS.map((s) => (
              <div key={s.num} className="flex flex-col gap-3.5 border-l border-white/20 py-1 pl-6">
                <span className="text-eyebrow text-muted-2">{s.num}</span>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-4">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Where we are */}
      <Section className="py-10">
        <Container className="max-w-3xl">
          <h2 className="text-d-md text-ink">Where we are</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            A UK-registered company based in Ilford, supporting families across the UAE, UK, USA,
            Canada, and Pakistan.
          </p>
          <p className="mt-3 text-md text-muted">{CONTACT_ADDRESS}</p>
        </Container>
      </Section>

      <Section>
        <Container className="grid items-start gap-6 lg:grid-cols-2">
          <CtaBand
            headline="Ready to get started?"
            sub={`Submit an inquiry and we'll match you with a tutor ${SLA_RESPONSE_TIME}.`}
          />
          <div>
            <h2 className="mb-5 text-d-md text-ink">Common questions</h2>
            <FaqList items={ABOUT_FAQS} />
          </div>
        </Container>
      </Section>
    </>
  );
}
