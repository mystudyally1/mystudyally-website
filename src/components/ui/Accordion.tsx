"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface AccordionItemData {
  question: string;
  answer: ReactNode;
}

export function Accordion({
  items,
  className,
}: {
  items: AccordionItemData[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn("flex flex-col divide-y divide-border", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-md font-bold text-ink"
            >
              {item.question}
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
              <div className="pb-5 text-md leading-relaxed text-muted">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
