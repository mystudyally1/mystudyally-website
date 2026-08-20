"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { TUTORS, TUTOR_FILTERS } from "@/data/tutors";

// Curriculum tags render with their full names in the card body.
const FORM_NAME: Record<string, string> = {
  IELTS: "IELTS Preparation",
  SAT: "SAT Preparation",
  American: "American Curriculum",
  Canadian: "Canadian Curriculum",
};

export function TutorGrid() {
  const [filter, setFilter] = useState("All");
  const options = ["All", ...TUTOR_FILTERS];
  const shown = filter === "All" ? TUTORS : TUTORS.filter((t) => t.tags.includes(filter));

  const resultCount =
    `${shown.length} ${shown.length === 1 ? "tutor" : "tutors"} · ` +
    (filter === "All" ? "showing all curricula" : filter);

  return (
    <>
      <h2 className="sr-only">Filter tutors by curriculum</h2>
      <div className="mb-[12px] flex flex-wrap gap-[10px]">
        {options.map((label) => {
          const on = filter === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setFilter(label)}
              aria-pressed={on}
              className={cn(
                "cursor-pointer whitespace-nowrap rounded-pill border px-[18px] py-[9px] text-12_5 font-bold",
                on
                  ? "border-ink bg-ink text-white"
                  : "border-[rgba(60,60,60,0.14)] bg-white text-muted",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        className="mb-[28px] text-13 font-semibold leading-[18px] text-muted-3"
        aria-live="polite"
      >
        {resultCount}
      </div>

      <div className="grid items-stretch gap-[20px] [grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr))]">
        {shown.map((t) => (
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
              <div className="mt-[2px] flex-1 text-12 text-muted">
                <span className="font-bold text-body">Curricula:</span>{" "}
                {t.tags.map((c) => FORM_NAME[c] ?? c).join(" & ")}
              </div>
              <Link
                href="/contact/"
                className="mt-[10px] border-t-2 border-border pt-[14px] text-11_5 font-bold tracking-[0.06em] text-body hover:text-link"
              >
                INQUIRE ABOUT THIS TUTOR ↗
              </Link>
            </div>
          </div>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="mx-auto mt-[8px] max-w-[640px] rounded-[22px] border-2 border-dashed border-border px-[clamp(20px,5vw,32px)] py-[48px] text-center">
          <p className="text-16 leading-[26px] text-muted">
            We don&#39;t have a tutor featured for {filter} yet — but our network is larger than
            what&#39;s shown here. Tell us what you need and we&#39;ll find the right match.
          </p>
          <Link
            href="/contact/"
            className="mt-[20px] inline-block rounded-[16px] bg-primary px-[24px] py-[13px] text-14 font-extrabold text-white shadow-[0_4px_0_#58A700] hover:bg-primary-hover hover:text-white"
          >
            Submit an inquiry
          </Link>
        </div>
      )}
    </>
  );
}
