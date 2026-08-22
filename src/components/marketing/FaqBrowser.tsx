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
      <div className="mx-[20px] mt-[4px] flex h-[44px] items-center gap-[10px] rounded-[12px] border border-[#D6DADC] bg-white px-[14px] md:mx-0 md:mt-[28px] md:h-auto md:gap-[12px] md:rounded-[14px] md:border-border md:px-[16px]">
        <span className="text-15 text-muted-3">⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions"
          aria-label="Search questions"
          className="min-w-0 flex-1 border-none bg-transparent text-14 font-semibold text-body outline-none placeholder:text-muted-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link md:py-[14px]"
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
        <p className="mx-[20px] mt-[10px] text-12_5 font-bold text-muted md:mx-0" aria-live="polite">
          {total} {total === 1 ? "answer" : "answers"} for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Rail + questions */}
      {/* Mobile turns the category rail into a scrollable chip row directly
          under the search box, per "Mobile Search + Chips". */}
      <div className="mt-[6px] flex flex-col md:mt-[44px] md:flex-row md:flex-wrap md:items-start md:gap-[clamp(28px,4vw,64px)]">
        <div className="md:flex-[1_1_200px] md:self-stretch">
          <nav className="flex gap-[8px] overflow-x-auto px-[20px] pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:sticky md:top-[72px] md:flex-col md:gap-0 md:overflow-visible md:px-0 md:pb-0">
            <div className="hidden pb-[12px] text-11 font-bold tracking-[0.14em] text-muted-3 md:block">
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
                  className="inline-flex h-[44px] shrink-0 items-center gap-[7px] whitespace-nowrap rounded-pill border border-border bg-white px-[16px] text-13 font-extrabold text-body hover:text-ink md:h-auto md:justify-between md:gap-[12px] md:rounded-none md:border-0 md:border-l-2 md:bg-transparent md:px-0 md:py-[11px] md:pl-[14px] md:text-14 md:font-semibold md:text-muted"
                >
                  {g.label}
                  <span className="text-12 font-bold text-muted-3">{count}</span>
                </a>
              );
            })}
            <p className="hidden pl-[14px] pt-[24px] text-12 leading-[1.65] text-muted-3 md:block">
              Curriculum-specific questions live on each curriculum page.
            </p>
          </nav>
        </div>

        <div className="px-[20px] pt-[20px] md:flex-[3_1_560px] md:px-0 md:pt-0">
          {groups.length === 0 && (
            <p className="text-14 leading-[1.7] text-muted md:text-15">
              No answers matched that search.{" "}
              <Link href="/contact/" className="font-bold">
                Ask us directly
              </Link>
              .
            </p>
          )}
          {groups.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-[120px] pb-[26px] md:scroll-mt-[96px] md:pb-[36px]">
              <h2 className="mb-[4px] text-11 font-extrabold uppercase tracking-[0.14em] text-muted-3 md:text-13 md:font-bold md:tracking-[0.12em]">
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
                        className="flex min-h-[56px] w-full cursor-pointer items-start justify-between gap-[14px] py-[16px] text-left text-14_5 font-bold leading-[1.45] text-ink md:min-h-0 md:items-center md:gap-[16px] md:py-[20px] md:text-15_5 md:text-body"
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
                          className="flex flex-col gap-[12px] pb-[12px] md:pb-[22px] md:pr-[40px]"
                        >
                          <p className="text-13_5 leading-[1.7] text-muted md:text-14 md:leading-[1.75]">
                            {f.a}
                          </p>
                          {f.linkLabel && f.linkHref && (
                            <Link
                              href={f.linkHref}
                              className="flex min-h-[44px] items-center self-start border-b-2 border-primary text-13 font-extrabold text-body hover:text-link md:min-h-0 md:pb-[2px] md:font-bold"
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
          <p className="text-12 leading-[1.6] text-muted-3 md:hidden">
            Curriculum-specific questions live on each curriculum page.
          </p>
        </div>
      </div>
    </>
  );
}
