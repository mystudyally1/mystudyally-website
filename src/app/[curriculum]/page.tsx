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
import { pageOpenGraph } from "@/lib/metadata";

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
    openGraph: pageOpenGraph({
      title: content.hero.h1,
      description,
      path: `/${curriculum}/`,
    }),
  };
}

// Mobile ("IGCSE Mobile.dc.html", Why Choose Us) stacks number, title and body
// with a 20px rhythm; the three-column rule only applies from md up.
const pillarRow =
  "flex flex-col gap-[8px] border-t border-border py-[20px] md:grid md:gap-[32px] md:py-[28px] md:[grid-template-columns:44px_minmax(min(100%,240px),1fr)_minmax(min(100%,240px),1fr)]";

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
        className="relative overflow-hidden px-[20px] pb-[10px] pt-[30px] md:px-[clamp(20px,5vw,32px)] md:pb-[48px] md:pt-[64px]"
      >
        <div
          className="pointer-events-none absolute hidden md:block -left-[160px] -top-[120px] h-[560px] w-[560px] blur-[24px]"
          style={{
            background: "radial-gradient(circle, rgba(88,204,2,0.15), rgba(88,204,2,0) 65%)",
          }}
        />
        <div className="relative mx-auto grid max-w-container items-start gap-[clamp(30px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          <div className="md:pt-[24px]">
            <span className="inline-block rounded-pill border border-link-light-3 bg-link-light/90 px-[13px] py-[6px] text-10_5 font-bold tracking-[0.12em] text-link-hover md:px-[14px] md:text-11">
              {content.hero.eyebrow}
            </span>
            <h1 className="mt-[16px] text-27 font-extrabold leading-[1.16] tracking-[-0.02em] [text-wrap:balance] md:mt-[20px] md:text-d44 md:leading-[1.1]">
              {content.hero.h1}
            </h1>
            <p className="mt-[16px] max-w-[520px] text-14_5 leading-[1.7] text-muted md:mt-[20px] md:text-15_5">
              {content.hero.sub}
            </p>
            <div className="mt-[20px] flex flex-wrap gap-[8px] md:mt-[26px] md:gap-[10px]">
              {content.trust.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-[7px] rounded-pill bg-primary-light px-[14px] py-[7px] text-12 font-bold text-primary-shadow md:gap-[8px] md:px-[16px] md:py-[8px] md:text-12_5"
                >
                  <span className="font-extrabold">✓</span>
                  {t}
                </span>
              ))}
            </div>
            {/* Mobile only. On mobile the form sits in its own section below
                the hero, so this is the jump link the design puts there
                ("Mobile Hero" -> href="#form"). From md up the form is beside
                the hero with its own submit button, and the desktop design has
                no button here — a second one would just be redundant. */}
            <a
              href="#inquire-form"
              className="mt-[22px] flex min-h-[52px] items-center justify-center rounded-[16px] bg-primary text-14 font-extrabold uppercase tracking-[0.03em] text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white md:hidden"
            >
              Submit an Inquiry
            </a>
          </div>
          <div id="inquire-form" className="mt-[12px] md:mt-0">
            <InquiryFormLazy variant="compact" presetCurriculum={meta.name} />
          </div>
        </div>
      </section>

      {/* Tutors. Mobile is a snap rail, not a grid — see "Mobile Tutors" in
          "IGCSE Mobile.dc.html". The section drops its horizontal padding so
          the cards bleed to the edge as they scroll. */}
      {content.tutors.length > 0 && (
        <section id="tutors" className="pb-[8px] pt-[34px] md:px-[clamp(20px,5vw,32px)] md:pb-[48px] md:pt-[24px]">
          <div className="mx-auto max-w-container">
            <div className="mb-[16px] flex items-start justify-between gap-[14px] px-[20px] md:mb-[40px] md:flex-wrap md:items-end md:gap-[24px] md:px-0">
              <h2 className="max-w-[560px] text-21 font-extrabold tracking-[-0.01em] [text-wrap:balance] md:text-d34">
                Some of the tutors you could be matched with
              </h2>
              <span className="h-fit shrink-0 whitespace-nowrap rounded-pill border-2 border-border bg-white px-[12px] py-[5px] text-9_5 font-bold tracking-[0.14em] shadow-[0_2px_0_#E5E5E5] md:px-[16px] md:py-[6px] md:text-10 md:tracking-[0.16em]">
                {meta.shortName.toUpperCase()} TUTORS
              </span>
            </div>
            <div className="flex snap-x snap-mandatory items-stretch gap-[14px] overflow-x-auto px-[24px] pb-[12px] pt-[4px] [scroll-padding-left:24px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:gap-[20px] md:overflow-visible md:px-0 md:pb-0 md:pt-0 md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
              {content.tutors.map((t) => (
                <div
                  key={t.photoId}
                  className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border-2 border-border bg-white shadow-[0_2px_0_#E5E5E5] md:w-auto md:shrink md:transition-[box-shadow,transform] md:duration-[250ms] md:hover:-translate-y-[3px] md:hover:shadow-[0_4px_0_#E5E5E5]"
                >
                  <div className="relative aspect-[4/3] bg-surface-alt md:aspect-auto md:h-[220px]">
                    <Image
                      src={`/images/tutors/${t.photoId}.webp`}
                      alt={t.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 260px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[8px] px-[24px] pb-[24px] pt-[22px]">
                    <h3 className="text-17 font-bold md:text-18">{t.name}</h3>
                    <div className="text-12 font-semibold text-muted md:text-12_5">
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
                      className="mt-[6px] flex min-h-[44px] items-center border-t-2 border-border pt-[12px] text-11_5 font-bold tracking-[0.06em] text-body hover:text-link md:mt-[10px] md:min-h-0 md:pt-[14px]"
                    >
                      INQUIRE ABOUT THIS TUTOR ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center px-[20px] pt-[8px] md:mt-[32px] md:pt-0">
              <Link
                href="/tutors/"
                className="flex min-h-[44px] items-center border-b-2 border-primary text-13 font-bold text-body hover:text-link md:min-h-0 md:pb-[2px]"
              >
                Meet All Our Tutors ↗
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How matching works */}
      <section
        id="how"
        className="mt-[28px] bg-surface-dark px-[20px] pb-[44px] pt-[40px] md:my-[24px] md:px-[clamp(20px,5vw,32px)] md:pb-[76px] md:pt-[72px]"
      >
        <div className="mx-auto max-w-container">
          <div className="mb-[26px] max-w-[640px] md:mb-[52px]">
            <div className="mb-[12px] text-10_5 font-bold tracking-[0.16em] text-muted-2 md:mb-[14px] md:text-11">
              HOW MATCHING WORKS
            </div>
            <h2 className="text-22 font-extrabold tracking-[-0.01em] text-white [text-wrap:balance] md:text-d34">
              You don&#39;t browse tutors. <span className="text-muted-2">We match you.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-[26px] border-l border-white/[0.22] pl-[18px] md:grid md:gap-y-[40px] md:border-l-0 md:pl-0 md:[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {content.steps.map((s) => (
              <div
                key={s.num}
                className="flex flex-col gap-[8px] md:gap-[14px] md:border-l md:border-white/[0.22] md:px-[36px] md:pb-[8px] md:pt-[4px]"
              >
                <span className="text-10_5 font-bold tracking-[0.16em] text-muted-2 md:text-11">
                  {s.num}
                </span>
                <h3 className="text-17 font-bold text-white md:text-19">{s.title}</h3>
                <p className="text-13_5 leading-[1.7] text-muted-4 md:text-14">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-[28px] md:mt-[52px]">
            <a
              href="#inquire-form"
              className="flex min-h-[52px] items-center justify-center rounded-[16px] bg-primary text-14 font-extrabold uppercase tracking-[0.03em] text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white md:inline-block md:min-h-0 md:px-[24px] md:py-[13px]"
            >
              Start Your Journey
            </a>
          </div>
        </div>
      </section>

      {/* Why it's different here */}
      {content.pillars.length > 0 && (
        <section className="px-[20px] pb-[6px] pt-[34px] md:px-[clamp(20px,5vw,32px)] md:pb-[32px] md:pt-[48px]">
          <div className="mx-auto max-w-[1080px]">
            <h2 className="mb-[6px] text-21 font-extrabold tracking-[-0.01em] md:mb-[40px] md:text-d30">
              {content.headings.why ?? `Why ${meta.name} tutoring is different here`}
            </h2>
            <div className="flex flex-col">
              {content.pillars.map((p) => (
                <div key={p.num} className={pillarRow}>
                  <span className="text-20 font-extrabold leading-none tracking-[0.02em] text-muted-3 md:pt-[1px] md:text-24">
                    {p.num}
                  </span>
                  <h3 className="text-16 font-bold text-body md:text-18">{p.title}</h3>
                  <p className="text-14 leading-[1.7] text-muted md:col-start-auto md:text-14_5 md:leading-[1.75]">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subjects covered */}
      {content.subjects.length > 0 && (
        <section className="mt-[24px] bg-surface-alt px-[20px] pb-[36px] pt-[34px] md:my-[24px] md:px-[clamp(20px,5vw,32px)] md:pb-[68px] md:pt-[64px]">
          <div className="mx-auto max-w-container">
            <h2 className="mb-[6px] text-21 font-extrabold tracking-[-0.01em] md:mb-[36px] md:text-d30">
              {content.headings.subjects ?? `Subjects we cover for ${meta.name}`}
            </h2>
            <div className="flex flex-col md:grid md:gap-[16px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
              {content.subjects.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col gap-[6px] border-t border-[#E2E2E2] py-[16px] md:gap-[10px] md:rounded-[18px] md:border-t-0 md:px-[26px] md:py-[24px] md:transition-[background,box-shadow,transform] md:duration-200 md:hover:-translate-y-[2px] md:hover:bg-white md:hover:shadow-[0_2px_0_#E5E5E5]"
                >
                  <div className="flex items-start gap-[10px]">
                    <SubjectIcon name={s.name} className="shrink-0 text-link" />
                    <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-[8px] gap-y-[2px]">
                      <h3 className="text-15_5 font-bold text-body md:text-16">{s.name}</h3>
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
      <section className="px-[20px] py-[30px] md:px-[clamp(20px,5vw,32px)] md:pb-[48px] md:pt-[40px]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-15 font-bold leading-[1.65] text-body [text-wrap:balance] md:text-d22 md:leading-[1.6]">
            MyStudyAlly is new. Your trial session is free precisely so you don&#39;t have to take
            our word for it.
          </p>
        </div>
      </section>

      {/* Get started + FAQ */}
      <section id="get-started" className="px-[20px] pb-[36px] pt-[6px] md:px-[clamp(20px,5vw,32px)] md:pb-[72px] md:pt-[56px]">
        {/* column-reverse on mobile, per the design: the questions come first
            and the CTA card closes the page. */}
        <div className="mx-auto flex max-w-container flex-col-reverse gap-[26px] md:grid md:items-start md:gap-[24px] md:[grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          <GetStartedPanel
            headline="Ready to get started?"
            sub="Submit an inquiry and we'll match you with a tutor within 24h."
          />
          <div>
            <h2 className="mb-[16px] text-21 font-extrabold tracking-[-0.01em] md:mb-[20px] md:text-d28">
              Common Questions
            </h2>
            <FaqList items={content.faqs} defaultOpen={curriculum === "igcse" ? -1 : 0} />
          </div>
        </div>
      </section>
    </>
  );
}
