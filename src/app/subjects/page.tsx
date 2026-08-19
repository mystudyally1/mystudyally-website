import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/marketing/CtaBand";
import { SUBJECT_GROUPS } from "@/data/subject-groups";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Subjects & Curricula",
  description:
    "Every curriculum and subject MyStudyAlly covers — IGCSE, GCSE, A Levels, IB, SABIS, HKDSE, American and Canadian curricula, plus IELTS and SAT preparation.",
  alternates: { canonical: `${SITE_URL}/subjects/` },
};

export default function SubjectsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-[clamp(20px,5vw,32px)] pb-[48px] pt-[72px]">
        <div
          className="pointer-events-none absolute -right-[140px] -top-[120px] h-[560px] w-[560px] blur-[24px]"
          style={{
            background:
              "radial-gradient(circle, rgba(88,204,2,0.14), rgba(88,204,2,0) 65%)",
          }}
        />
        <div className="relative mx-auto max-w-container text-center">
          <span className="inline-block rounded-pill border border-link-light-3 bg-link-light/90 px-[14px] py-[6px] text-11 font-bold tracking-[0.12em] text-link-hover">
            ALL SUBJECTS
          </span>
          <h1 className="mx-auto mt-[18px] max-w-[640px] text-d44 font-extrabold tracking-[-0.02em] [text-wrap:balance]">
            Every subject, grouped by curriculum
          </h1>
          <p className="mx-auto mt-[16px] max-w-[560px] text-15 leading-[1.65] text-muted">
            Find your child&#39;s exact curriculum and subject — every tutor is matched to the
            syllabus they&#39;re actually being examined on.
          </p>
        </div>
      </section>

      {/* Directory */}
      <section className="px-[clamp(20px,5vw,32px)] pb-[72px] pt-[24px]">
        <div className="mx-auto grid max-w-container gap-[20px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {SUBJECT_GROUPS.map((g) => (
            <div
              key={g.slug}
              className="rounded-[22px] border-2 border-border bg-white p-[26px] shadow-[0_2px_0_#E5E5E5]"
            >
              <div className="mb-[8px] flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-link-light text-14 font-extrabold text-link">
                    {g.glyph}
                  </span>
                  <h2 className="text-19 font-extrabold">{g.name}</h2>
                </div>
                <Link
                  href={`/${g.slug}/`}
                  className="text-11_5 font-bold tracking-[0.08em] text-link hover:text-link-hover"
                >
                  VIEW CURRICULUM ↗
                </Link>
              </div>
              <p className="mb-[16px] text-12_5 leading-[1.55] text-muted">{g.desc}</p>
              <div className="flex flex-wrap gap-[8px]">
                {g.subjects.map((s) => (
                  <Link
                    key={s}
                    href={`/${g.slug}/`}
                    className="rounded-pill border-2 border-border bg-white px-[14px] py-[7px] text-12 font-semibold text-body hover:border-[#89E219] hover:bg-surface-alt hover:text-link-hover"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        eyebrow="GET MATCHED"
        headline="Can't find the exact subject?"
        sub="Tell us what your child needs — we cover more than what's listed here."
      />
    </>
  );
}
