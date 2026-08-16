"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface FaqItem {
  q: string;
  a: string;
}

/** Card-style FAQ accordion used on curriculum pages. */
export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-xl border-2 border-border bg-white shadow-[0_2px_0_#E5E5E5]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-ink"
            >
              {item.q}
              <span className="text-lg font-normal text-link">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <p className="px-5 pb-4.5 text-sm leading-relaxed text-muted">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
