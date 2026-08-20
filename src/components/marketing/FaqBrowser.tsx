"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { FAQ_GROUPS } from "@/data/faqs";

export function FaqBrowser() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string>("");

  const q = query.trim().toLowerCase();
  const groups = useMemo(
    () =>
      FAQ_GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((f) => !q || (f.q + " " + f.a).toLowerCase().includes(q)),
      })).filter((g) => g.items.length > 0),
    [q],
  );

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      {/* Search sits in the hero block in the design */}
      <div className="mt-[28px] flex items-center gap-[12px] rounded-[14px] border border-border bg-white px-[16px]">
        <span className="text-15 text-muted-3">⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions"
          aria-label="Search questions"
          className="flex-1 border-none bg-transparent py-[14px] text-14 font-semibold text-body outline-none placeholder:text-muted-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="inline-flex h-[24px] w-[24px] shrink-0 cursor-pointer items-center justify-center rounded-pill bg-surface-alt text-12 text-muted"
          >
            ×
          </button>
        )}
      </div>
      {q && (
        <p className="mt-[10px] text-12_5 font-bold text-muted" aria-live="polite">
          {total} {total === 1 ? "answer" : "answers"} for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Rail + questions */}
      <div className="mt-[44px] flex flex-wrap items-start gap-[clamp(28px,4vw,64px)]">
        <div className="flex-[1_1_200px] self-stretch">
          <nav className="sticky top-[72px] flex flex-col">
            <div className="pb-[12px] text-11 font-bold tracking-[0.14em] text-muted-3">
              CATEGORIES
            </div>
            {FAQ_GROUPS.map((g) => {
              const count = g.items.filter(
                (f) => !q || (f.q + " " + f.a).toLowerCase().includes(q),
              ).length;
              return (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="flex items-baseline justify-between gap-[12px] border-l-2 border-border py-[11px] pl-[14px] text-14 font-semibold text-muted hover:text-ink"
                >
                  {g.label}
                  <span className="text-12 font-bold text-muted-3">{count}</span>
                </a>
              );
            })}
            <p className="mt-[24px] pl-[14px] text-12 leading-[1.65] text-muted-3">
              Curriculum-specific questions live on each curriculum page.
            </p>
          </nav>
        </div>

        <div className="flex-[3_1_560px]">
          {groups.length === 0 && (
            <p className="text-15 text-muted">
              No answers matched that search.{" "}
              <Link href="/contact/" className="font-bold">
                Ask us directly
              </Link>
              .
            </p>
          )}
          {groups.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-[96px] pb-[36px]">
              <h2 className="mb-[4px] text-13 font-bold uppercase tracking-[0.12em] text-muted-3">
                {g.label}
              </h2>
              <div className="flex flex-col">
                {g.items.map((f) => {
                  const isOpen = q ? true : open === f.id;
                  return (
                    <div key={f.id} id={f.id} className="scroll-mt-[96px] border-b border-border">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen && !q ? "" : f.id)}
                        aria-expanded={isOpen}
                        aria-controls={`${f.id}-panel`}
                        id={`${f.id}-trigger`}
                        className="flex w-full cursor-pointer items-center justify-between gap-[16px] py-[20px] text-left text-15_5 font-bold text-body"
                      >
                        {f.q}
                        <span
                          className={cn("shrink-0 text-17 font-semibold text-muted-3")}
                          aria-hidden="true"
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen && (
                        <div
                          id={`${f.id}-panel`}
                          role="region"
                          aria-labelledby={`${f.id}-trigger`}
                          className="flex flex-col gap-[12px] pb-[22px] pr-[40px]"
                        >
                          <p className="text-14 leading-[1.75] text-muted">{f.a}</p>
                          {f.linkLabel && f.linkHref && (
                            <Link
                              href={f.linkHref}
                              className="self-start border-b-2 border-primary pb-[2px] text-13 font-bold text-body hover:text-link"
                            >
                              {f.linkLabel} →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
