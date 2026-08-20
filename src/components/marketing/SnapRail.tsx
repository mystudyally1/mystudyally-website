"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Horizontal snap rail for the mobile carousels (tutor cards, plan cards),
 * with the position dots the design shows underneath.
 *
 * The cards stay server-rendered and are passed in as children —
 * this only owns the scroll position, so the island is a few hundred bytes
 * rather than the whole section.
 *
 * From md up the rail becomes the desktop grid and the dots are hidden, so the
 * same markup serves both designs.
 */
export function SnapRail({
  count,
  cardStep,
  railClass,
  gridClass,
  children,
}: {
  /** Number of cards, for the dot row. */
  count: number;
  /** Card width + gap, in px — how far one swipe travels. */
  cardStep: number;
  /** Rail spacing below md (gap + padding). */
  railClass: string;
  /** Grid classes applied from md up. */
  gridClass: string;
  children: ReactNode;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  return (
    <>
      <div
        ref={railRef}
        onScroll={(e) => {
          const i = Math.round(e.currentTarget.scrollLeft / cardStep);
          const next = Math.max(0, Math.min(count - 1, i));
          if (next !== active) setActive(next);
        }}
        className={`flex snap-x snap-mandatory items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:overflow-visible ${railClass} ${gridClass}`}
      >
        {children}
      </div>
      {/* Decorative: the rail is scrollable and every card is reachable by
          swiping or tabbing, so these carry no semantics of their own. */}
      <div aria-hidden="true" className="mt-[6px] flex justify-center gap-[7px] md:hidden">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={`h-[7px] rounded-pill transition-all duration-200 ${
              i === active ? "w-[20px] bg-primary" : "w-[7px] bg-[#DBDBDB]"
            }`}
          />
        ))}
      </div>
    </>
  );
}
