"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { TUTORS, TUTOR_FILTERS } from "@/data/tutors";

export function TutorGrid() {
  const [filter, setFilter] = useState<string | null>(null);
  const shown = filter ? TUTORS.filter((t) => t.tags.includes(filter)) : TUTORS;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={cn(
            "rounded-pill border-2 px-4 py-2 text-sm font-bold transition",
            filter === null
              ? "border-link-light-3 bg-link-light text-link-hover"
              : "border-border bg-white text-muted hover:border-muted-3",
          )}
        >
          All tutors
        </button>
        {TUTOR_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-pill border-2 px-4 py-2 text-sm font-bold transition",
              filter === f
                ? "border-link-light-3 bg-link-light text-link-hover"
                : "border-border bg-white text-muted hover:border-muted-3",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="mb-6 text-sm text-muted" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "tutor" : "tutors"}
        {filter ? ` for ${filter}` : ""}.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
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
              <div className="text-xs font-bold leading-relaxed text-link">{t.expertise}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {t.subjects.map((s) => (
                  <span
                    key={s}
                    className="whitespace-nowrap rounded-pill bg-surface-alt px-3 py-1 text-xs font-semibold text-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex-1" />
              <Link
                href="/contact/"
                className="mt-2.5 border-t-2 border-border pt-3.5 text-xs font-bold tracking-wide text-ink hover:text-link"
              >
                INQUIRE ABOUT THIS TUTOR ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
