import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/ui/FaqList";
import { GetStartedPanel } from "@/components/marketing/GetStartedPanel";
import { SubjectIcon } from "@/components/marketing/SubjectIcon";
import { InquiryFormLazy } from "@/components/forms/InquiryFormLazy";
import { CURRICULA, getCurriculumBySlug } from "@/data/curricula";
import { CURRICULUM_PAGES } from "@/data/curriculum-pages";
import { NOINDEX_CURRICULA, SITE_URL } from "@/lib/constants";

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

const pillarRow =
  "grid gap-[32px] border-t border-border py-[28px] grid-cols-[44px_1fr] md:[grid-template-columns:44px_minmax(min(100%,240px),1fr)_minmax(min(100%,240px),1fr)]";

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
      <section
        id="inquire"
        className="relative overflow-hidden px-[clamp(20px,5vw,32px)] pb-[48px] pt-[64px]"
      >
        <div
          className="pointer-events-none absolute hidden md:block -left-[160px] -top-[120px] h-[560px] w-[560px] blur-[24px]"
          style={{
            background: "radial-gradient(circle, rgba(88,204,2,0.15), rgba(88,204,2,0) 65%)",
          }}
        />
        <div className="relative mx-auto grid max-w-container items-start gap-[clamp(30px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          <div className="pt-[24px]">
            <span className="inline-block rounded-pill border border-link-light-3 bg-link-light/90 px-[14px] py-[6px] text-11 font-bold tracking-[0.12em] text-link-hover">
              {content.hero.eyebrow}
            </span>
            <h1 className="mt-[20px] text-d44 font-extrabold leading-[1.1] tracking-[-0.02em] [text-wrap:balance]">
              {content.hero.h1}
            </h1>
            <p className="mt-[20px] max-w-[520px] text-15_5 leading-[1.7] text-muted">
              {content.hero.sub}
            </p>
            <div className="mt-[26px] flex flex-wrap gap-[10px]">
              {content.trust.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-[8px] rounded-pill bg-primary-light px-[16px] py-[8px] text-12_5 font-bold text-primary-shadow"
                >
                  <span className="font-extrabold">✓</span>
                  {t}
                </span>
              ))}
            </div>
            <a
              href="#inquire-form"
              className="mt-[28px] inline-block rounded-[16px] bg-primary px-[26px] py-[14px] text-14 font-extrabold uppercase tracking-[0.03em] text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white"
            >
              Submit an Inquiry
            </a>
          </div>
          <div id="inquire-form">
            <InquiryFormLazy variant="compact" presetCurriculum={meta.name} />
          </div>
        </div>
      </section>

      {/* Tutors */}
      {content.tutors.length > 0 && (
        <section id="tutors" className="px-[clamp(20px,5vw,32px)] pb-[48px] pt-[24px]">
          <div className="mx-auto max-w-container">
            <div className="mb-[40px] flex flex-wrap items-end justify-between gap-[24px]">
              <h2 className="max-w-[560px] text-d34 font-extrabold tracking-[-0.01em] [text-wrap:balance]">
                Some of the tutors you could be matched with
              </h2>
              <span className="h-fit rounded-pill border-2 border-border bg-white px-[16px] py-[6px] text-10 font-bold tracking-[0.16em] shadow-[0_2px_0_#E5E5E5]">
                {meta.shortName.toUpperCase()} TUTORS
              </span>
            </div>
            <div className="grid gap-[20px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
              {content.tutors.map((t) => (
                <div
                  key={t.photoId}
                  className="flex flex-col overflow-hidden rounded-[22px] border-2 border-border bg-white shadow-[0_2px_0_#E5E5E5] transition-[box-shadow,transform] duration-[250ms] hover:-translate-y-[3px] hover:shadow-[0_4px_0_#E5E5E5]"
                >
                  <div className="relative h-[220px] bg-surface-alt">
                    <Image
                      src={`/images/tutors/${t.photoId}.webp`}
                      alt={t.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 260px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[8px] px-[24px] pb-[24px] pt-[22px]">
                    <h3 className="text-18 font-bold">{t.name}</h3>
                    <div className="text-12_5 font-semibold text-muted">
                      {t.qual} · {t.years}
                    </div>
                    {t.subjects && (
                      <div className="mt-[4px] flex flex-wrap gap-[6px]">
                        {t.subjects.map((s) => (
                          <span
                            key={s}
                            className="inline-flex whitespace-nowrap rounded-pill bg-link-light px-[12px] py-[5px] text-11_5 font-bold text-link-hover"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {t.boards && (
                      <div className="mt-[2px] flex-1 text-12 text-muted">
                        <span className="font-bold text-body">Exam boards:</span> {t.boards}
                      </div>
                    )}
                    <a
                      href="#inquire-form"
                      className="mt-[10px] border-t-2 border-border pt-[14px] text-11_5 font-bold tracking-[0.06em] text-body hover:text-link"
                    >
                      INQUIRE ABOUT THIS TUTOR ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[32px] text-center">
              <Link
                href="/tutors/"
                className="border-b-2 border-primary pb-[2px] text-13 font-bold text-body hover:text-link"
              >
                Meet All Our Tutors ↗
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How matching works */}
      <section id="how" className="my-[24px] bg-surface-dark px-[clamp(20px,5vw,32px)] pb-[76px] pt-[72px]">
        <div className="mx-auto max-w-container">
          <div className="mb-[52px] max-w-[640px]">
            <div className="mb-[14px] text-11 font-bold tracking-[0.16em] text-muted-2">
              HOW MATCHING WORKS
            </div>
            <h2 className="text-d34 font-extrabold tracking-[-0.01em] text-white [text-wrap:balance]">
              You don&#39;t browse tutors. <span className="text-muted-2">We match you.</span>
            </h2>
          </div>
          <div className="grid gap-y-[40px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {content.steps.map((s) => (
              <div
                key={s.num}
                className="flex flex-col gap-[14px] border-l border-white/[0.22] px-[36px] pb-[8px] pt-[4px]"
              >
                <span className="text-11 font-bold tracking-[0.16em] text-muted-2">{s.num}</span>
                <h3 className="text-19 font-bold text-white">{s.title}</h3>
                <p className="text-14 leading-[1.7] text-muted-4">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-[52px]">
            <a
              href="#inquire-form"
              className="inline-block rounded-[16px] bg-primary px-[24px] py-[13px] text-14 font-extrabold uppercase tracking-[0.03em] text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white"
            >
              Start Your Journey
            </a>
          </div>
        </div>
      </section>

      {/* Why it's different here */}
      {content.pillars.length > 0 && (
        <section className="px-[clamp(20px,5vw,32px)] pb-[32px] pt-[48px]">
          <div className="mx-auto max-w-[1080px]">
            <h2 className="mb-[40px] text-d30 font-extrabold tracking-[-0.01em]">
              {content.headings.why ?? `Why ${meta.name} tutoring is different here`}
            </h2>
            <div className="flex flex-col">
              {content.pillars.map((p) => (
                <div key={p.num} className={pillarRow}>
                  <span className="pt-[1px] text-24 font-extrabold leading-none tracking-[0.02em] text-muted-3">
                    {p.num}
                  </span>
                  <h3 className="text-18 font-bold text-body">{p.title}</h3>
                  <p className="col-start-2 md:col-start-auto text-14_5 leading-[1.75] text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subjects covered */}
      {content.subjects.length > 0 && (
        <section className="my-[24px] bg-surface-alt px-[clamp(20px,5vw,32px)] pb-[68px] pt-[64px]">
          <div className="mx-auto max-w-container">
            <h2 className="mb-[36px] text-d30 font-extrabold tracking-[-0.01em]">
              {content.headings.subjects ?? `Subjects we cover for ${meta.name}`}
            </h2>
            <div className="grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
              {content.subjects.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col gap-[10px] rounded-[18px] px-[26px] py-[24px] transition-[background,box-shadow,transform] duration-200 hover:-translate-y-[2px] hover:bg-white hover:shadow-[0_2px_0_#E5E5E5]"
                >
                  <div className="flex items-start gap-[10px]">
                    <SubjectIcon name={s.name} className="shrink-0 text-link" />
                    <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-[8px] gap-y-[2px]">
                      <h3 className="text-16 font-bold text-body">{s.name}</h3>
                      {s.code && (
                        <span className="shrink-0 whitespace-nowrap text-10_5 font-bold tracking-[0.1em] text-muted-3 tabular-nums">
                          {s.code}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-13 leading-[1.65] text-muted">{s.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New brand note */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[48px] pt-[40px]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-d22 font-bold leading-[1.6] text-body [text-wrap:balance]">
            MyStudyAlly is new. Your trial session is free precisely so you don&#39;t have to take
            our word for it.
          </p>
        </div>
      </section>

      {/* Get started + FAQ */}
      <section id="get-started" className="px-[clamp(20px,5vw,32px)] pb-[72px] pt-[56px]">
        <div className="mx-auto grid max-w-container items-start gap-[24px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <GetStartedPanel
            headline="Ready to get started?"
            sub="Submit an inquiry and we'll match you with a tutor within 24h."
          />
          <div>
            <h2 className="mb-[20px] text-d28 font-extrabold tracking-[-0.01em]">
              Common Questions
            </h2>
            <FaqList items={content.faqs} defaultOpen={curriculum === "igcse" ? -1 : 0} />
          </div>
        </div>
      </section>
    </>
  );
}
