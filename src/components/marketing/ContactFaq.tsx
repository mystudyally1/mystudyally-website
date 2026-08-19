"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * The contact page's "Quick answers" deflection FAQ — plain rows with a
 * bottom rule, not the card accordion used elsewhere.
 * Mirrors the `Deflection FAQ` block in Contact.dc.html.
 */
const ITEMS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How much does tutoring cost?",
    a: (
      <>
        You buy a prepaid package of classes, and classes are deducted as sessions happen. Full
        rates are on the{" "}
        <Link href="/pricing/" className="underline">
          pricing page
        </Link>
        .
      </>
    ),
  },
  {
    q: "How does matching work?",
    a: (
      <>
        You tell us the curriculum and subjects; our team hand-picks a tutor who specialises in
        that exact exam board. See how it works on the{" "}
        <Link href="/igcse/" className="underline">
          IGCSE page
        </Link>
        .
      </>
    ),
  },
  {
    q: "Do you offer a free trial?",
    a: <>Yes — a 30-minute trial session, no card required.</>,
  },
  {
    q: "Which curricula do you cover?",
    a: (
      <>
        IGCSE, GCSE, A Levels, IB, SABIS, HKDSE, and the American and Canadian curricula — plus
        IELTS and SAT preparation.
      </>
    ),
  },
];

export function ContactFaq() {
  const [open, setOpen] = useState<number>(-1);

  return (
    <div className="flex flex-col">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-[16px] py-[18px] text-left text-15 font-bold text-body"
            >
              {item.q}
              <span className="text-18 font-normal text-muted-3" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="pb-[20px] pr-[clamp(20px,5vw,32px)] text-13_5 leading-[1.7] text-muted">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
