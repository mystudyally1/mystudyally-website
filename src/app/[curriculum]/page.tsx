import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/marketing/CtaBand";
import { SubjectIcon } from "@/components/marketing/SubjectIcon";
import { InquiryFormLazy } from "@/components/forms/InquiryFormLazy";
import { CURRICULA, getCurriculumBySlug } from "@/data/curricula";
import { CURRICULUM_PAGES } from "@/data/curriculum-pages";
import { NOINDEX_CURRICULA, SITE_URL, SLA_RESPONSE_TIME } from "@/lib/constants";

// Static export: only these slugs are generated, everything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return CURRICULA.map((c) => ({ curriculum: c.slug }));
}

export async function generateMetadata(props: PageProps<"/[curriculum]">): Promise<Metadata> {
  const { curriculum } = await props.params;
  const content = CURRICULUM_PAGES[curriculum];
  const meta = getCurriculumBySlug(curriculum);
  if (!content || !meta) return {};

  const description = content.hero.sub;
  return {
    title: content.hero.h1,
    description,
    alternates: { canonical: `${SITE_URL}/${curriculum}/` },
    // SABIS ships noindex until its subject list is verified against the real
    // tutor pool (see implementation plan, Part 3 item 4).
    robots: NOINDEX_CURRICULA.includes(curriculum) ? { index: false, follow: true } : undefined,
    openGraph: {
      title: content.hero.h1,
      description,
      url: `${SITE_URL}/${curriculum}/`,
      type: "website",
    },
  };
}

export default async function CurriculumPage(props: PageProps<"/[curriculum]">) {
  const { curriculum } = await props.params;
  const content = CURRICULUM_PAGES[curriculum];
  const meta = getCurriculumBySlug(curriculum);
  if (!content || !meta) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: content.hero.h1,
    description: content.hero.sub,
    provider: { "@type": "Organization", name: "MyStudyAlly", url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd, courseJsonLd]) }}
      />

      {/* Hero + inline inquiry form */}
      <Section className="pb-6 pt-12">
        <Container className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-block rounded-pill border border-link-light-3 bg-link-light/90 px-3.5 py-1.5 text-eyebrow text-link-hover">
              {content.hero.eyebrow}
            </span>
            <h1 className="mt-5 text-d-5xl text-ink">{content.hero.h1}</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">{content.hero.sub}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {content.trust.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-pill bg-primary-light px-4 py-2 text-xs font-bold text-primary-shadow"
                >
                  <span className="font-extrabold">✓</span>
                  {t}
                </span>
              ))}
            </div>
            <Button as="a" href="#inquire" className="mt-7 uppercase tracking-wide">
              Submit an inquiry
            </Button>
          </div>
          <div id="inquire" className="rounded-2xl border-2 border-border bg-white p-6 shadow-card">
            <h2 className="text-d-sm text-ink">Tell us what you need</h2>
            <p className="mt-2 text-sm text-muted">
              We reply {SLA_RESPONSE_TIME} — every inquiry is read by a person.
            </p>
            <InquiryFormLazy
              variant="compact"
              presetCurriculum={meta.name}
              className="mt-5"
            />
          </div>
        </Container>
      </Section>

      {/* Tutors */}
      {content.tutors.length > 0 && (
        <Section className="py-12">
          <Container>
            <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-lg text-d-lg text-ink">
                Some of the tutors you could be matched with
              </h2>
              <span className="rounded-pill border-2 border-border bg-white px-4 py-1.5 text-eyebrow text-muted shadow-[0_2px_0_#E5E5E5]">
                {meta.shortName.toUpperCase()} TUTORS
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.tutors.map((t) => (
                <div
                  key={t.photoId}
                  className="flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-white shadow-[0_2px_0_#E5E5E5] transition hover:-translate-y-1 hover:shadow-[0_4px_0_#E5E5E5]"
                >
                  <div className="relative h-55 bg-surface-alt">
                    <Image
                      src={`/images/tutors/${t.photoId}.webp`}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <h3 className="text-lg font-bold text-ink">{t.name}</h3>
                    <div className="text-xs font-semibold text-muted">
                      {t.qual} · {t.years}
                    </div>
                    {t.subjects && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {t.subjects.map((s) => (
                          <span
                            key={s}
                            className="whitespace-nowrap rounded-pill bg-link-light px-3 py-1 text-xs font-bold text-link-hover"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {t.boards && (
                      <div className="mt-0.5 flex-1 text-xs text-muted">
                        <span className="font-bold text-ink">Exam boards:</span> {t.boards}
                      </div>
                    )}
                    <a
                      href="#inquire"
                      className="mt-2.5 border-t-2 border-border pt-3.5 text-xs font-bold tracking-wide text-ink hover:text-link"
                    >
                      INQUIRE ABOUT THIS TUTOR ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/tutors/"
                className="border-b-2 border-primary pb-0.5 text-sm font-bold text-ink"
              >
                Meet All Our Tutors ↗
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* How matching works */}
      <Section className="my-6 bg-surface-dark">
        <Container>
          <div className="mb-11 max-w-xl">
            <div className="mb-3.5 text-eyebrow text-muted-2">HOW MATCHING WORKS</div>
            <h2 className="text-d-lg text-white">
              You don&rsquo;t browse tutors. <span className="text-muted-2">We match you.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {content.steps.map((s) => (
              <div key={s.num} className="flex flex-col gap-3.5 border-l border-white/20 py-1 pl-8">
                <span className="text-eyebrow text-muted-2">{s.num}</span>
                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                <p className="text-md leading-relaxed text-muted-4">{s.body}</p>
              </div>
            ))}
          </div>
          <Button as="a" href="#inquire" className="mt-11 uppercase tracking-wide">
            Submit an inquiry
          </Button>
        </Container>
      </Section>

      {/* Why it's different here */}
      {content.pillars.length > 0 && (
        <Section className="py-12">
          <Container className="max-w-4xl">
            <h2 className="mb-10 text-d-md text-ink">
              {content.headings.why ?? `Why ${meta.name} tutoring is different here`}
            </h2>
            <div className="flex flex-col">
              {content.pillars.map((p) => (
                <div
                  key={p.num}
                  className="grid grid-cols-[44px_1fr] gap-6 border-t border-border py-7 sm:grid-cols-[44px_1fr_1fr]"
                >
                  <span className="text-2xl font-extrabold text-muted-3">{p.num}</span>
                  <h3 className="text-lg font-bold text-ink">{p.title}</h3>
                  <p className="text-md leading-relaxed text-muted sm:col-start-3">{p.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Subjects covered */}
      {content.subjects.length > 0 && (
        <Section className="my-6 bg-surface-alt">
          <Container>
            <h2 className="mb-9 text-d-md text-ink">
              {content.headings.subjects ?? `Subjects we cover for ${meta.name}`}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.subjects.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col gap-2.5 rounded-xl p-6 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_2px_0_#E5E5E5]"
                >
                  <div className="flex items-start gap-2.5">
                    <SubjectIcon name={s.name} className="shrink-0 text-link" />
                    <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <h3 className="text-md font-bold text-ink">{s.name}</h3>
                      {s.code && (
                        <span className="shrink-0 whitespace-nowrap text-[10.5px] font-bold tracking-wide text-muted-3 tabular-nums">
                          {s.code}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{s.blurb}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* New brand note */}
      <Section className="py-10">
        <Container className="max-w-2xl text-center">
          <p className="text-d-sm font-bold leading-relaxed text-ink">
            MyStudyAlly is new. Your trial session is free precisely so you don&rsquo;t have to
            take our word for it.
          </p>
        </Container>
      </Section>

      {/* Get started + FAQ */}
      <Section>
        <Container className="grid items-start gap-6 lg:grid-cols-2">
          <CtaBand
            headline="Ready to get started?"
            sub={`Submit an inquiry and we'll match you with a tutor ${SLA_RESPONSE_TIME}.`}
          />
          <div>
            <h2 className="mb-5 text-d-md text-ink">Common Questions</h2>
            <FaqList items={content.faqs} />
          </div>
        </Container>
      </Section>
    </>
  );
}
