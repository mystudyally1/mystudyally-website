"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Card-style FAQ accordion. Values mirror the design's `Common Questions`
 * block; `defaultOpen` matches each page's initial `openFaq` state
 * (0 on most pages, -1 — all closed — on Pricing and IGCSE).
 */
export function FaqList({
  items,
  className,
  defaultOpen = 0,
}: {
  items: FaqItem[];
  className?: string;
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);

  return (
    <div className={cn("flex flex-col gap-[12px]", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-[18px] border-2 border-border bg-white shadow-[0_2px_0_#E5E5E5]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-trigger-${i}`}
              className="flex w-full cursor-pointer items-center justify-between gap-[16px] px-[20px] py-[16px] text-left text-14 font-bold text-body"
            >
              {item.q}
              <span className="text-18 font-normal text-link" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                className="px-[20px] pb-[18px] text-13 leading-[1.7] text-muted"
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
