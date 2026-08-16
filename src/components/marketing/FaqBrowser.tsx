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
    <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <label htmlFor="faq-search" className="mb-2 block text-sm font-bold text-ink">
          Search
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="w-full rounded-md border-2 border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-3 focus:border-link focus:outline-none"
        />
        <nav className="mt-6 flex flex-col gap-1">
          {FAQ_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted hover:bg-link-light hover:text-link-hover"
            >
              {g.label}
            </a>
          ))}
        </nav>
      </aside>

      <div>
        {q && (
          <p className="mb-6 text-sm text-muted" aria-live="polite">
            {total} {total === 1 ? "answer" : "answers"} matching &ldquo;{query}&rdquo;.
          </p>
        )}
        {groups.length === 0 && (
          <p className="text-md text-muted">
            No answers matched that search.{" "}
            <Link href="/contact/" className="font-bold">
              Ask us directly
            </Link>
            .
          </p>
        )}
        <div className="flex flex-col gap-12">
          {groups.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-24">
              <h2 className="mb-5 text-d-md text-ink">{g.label}</h2>
              <div className="flex flex-col divide-y divide-border border-y border-border">
                {g.items.map((f) => {
                  const isOpen = q ? true : open === f.id;
                  return (
                    <div key={f.id} id={f.id} className="scroll-mt-24">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen && !q ? "" : f.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left text-md font-bold text-ink"
                      >
                        {f.q}
                        <span
                          className={cn(
                            "shrink-0 text-muted transition-transform",
                            isOpen && "rotate-180",
                          )}
                        >
                          ▾
                        </span>
                      </button>
                      {isOpen && (
                        <div className="pb-5">
                          <p className="text-md leading-relaxed text-muted">{f.a}</p>
                          {f.linkLabel && f.linkHref && (
                            <Link
                              href={f.linkHref}
                              className="mt-3 inline-block border-b-2 border-primary pb-0.5 text-sm font-bold text-ink"
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
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
