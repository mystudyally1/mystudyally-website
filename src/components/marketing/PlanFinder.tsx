"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { recommendPlan, type PlanOption } from "@/lib/plan-finder";

const MAX_PER_WEEK = 6;

/** "Premium, shared" / "Starter x2" — how the household would actually buy it. */
function optionLabel(o: PlanOption): string {
  if (o.shared) return `one ${o.plan.name}, shared`;
  return o.quantity > 1 ? `${o.quantity} x ${o.plan.name}` : o.plan.name;
}

export function PlanFinder() {
  const [kids, setKids] = useState(1);
  const [subj, setSubj] = useState(1);
  const [spw, setSpw] = useState(2);

  const rec = recommendPlan(kids, subj, spw);
  const { option, alternative } = rec;

  const seg = (
    options: { label: string; value: number }[],
    current: number,
    set: (v: number) => void,
    groupLabel: string,
  ) => (
    <div className="flex gap-[8px]" role="group" aria-label={groupLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => set(o.value)}
          aria-pressed={current === o.value}
          className={cn(
            "flex-1 cursor-pointer rounded-[12px] border py-[10px] text-13 font-extrabold",
            current === o.value
              ? "border-link-light-3 bg-link-light text-link-hover"
              : "border-border bg-white text-muted",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-[24px] grid items-start gap-[24px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
      <div className="flex flex-col gap-[22px] rounded-[16px] border border-border bg-white p-[26px] shadow-[0_2px_8px_rgba(60,60,60,0.06)]">
        <div>
          <div className="mb-[9px] text-13 font-extrabold">How many children need tutoring?</div>
          {seg(
            [
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3+", value: 3 },
            ],
            kids,
            setKids,
            "Number of children",
          )}
        </div>
        <div>
          <div className="mb-[9px] text-13 font-extrabold">How many subjects in total?</div>
          {seg(
            [
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4+", value: 4 },
            ],
            subj,
            setSubj,
            "Number of subjects",
          )}
        </div>
        <div>
          <div className="mb-[9px] flex items-baseline justify-between gap-[12px]">
            <span className="text-13 font-extrabold">
              Classes a week{kids > 1 ? ", per child" : ""}
            </span>
            <span className="text-13 font-extrabold text-link-hover">{spw}x/week</span>
          </div>
          <input
            type="range"
            min={1}
            max={MAX_PER_WEEK}
            step={1}
            value={spw}
            onChange={(e) => setSpw(Number(e.target.value))}
            aria-label={kids > 1 ? "Classes per week per child" : "Classes per week"}
            className="w-full cursor-pointer accent-primary"
          />
          <div className="mt-[6px] text-12 font-bold text-primary-shadow">
            {kids > 1
              ? `${rec.totalPerWeek} classes a week across ${kids === 3 ? "3+" : kids} children`
              : `${rec.totalPerWeek} ${rec.totalPerWeek === 1 ? "class" : "classes"} a week`}
          </div>
        </div>
        {(kids === 3 || subj === 4) && (
          <p className="text-12 leading-[1.6] text-muted-3">
            Costed for {kids === 3 ? "3 children" : ""}
            {kids === 3 && subj === 4 ? " and " : ""}
            {subj === 4 ? "4 subjects" : ""} — tell us if there are more and we&#39;ll price it
            properly.
          </p>
        )}
      </div>

      {/* The recommendation recomputes on every input change; without a live
          region a screen reader user hears the controls but never the answer. */}
      <div aria-live="polite">
        <div className="rounded-[16px] border border-link-hover bg-link p-[26px] px-[28px] shadow-[0_14px_32px_rgba(28,176,246,0.30)]">
          <div className="text-11 font-extrabold tracking-[0.14em] text-link-light">
            OUR RECOMMENDATION
          </div>
          <div className="mt-[12px] flex flex-wrap items-baseline gap-x-[14px] gap-y-[6px]">
            <span className="text-d30 font-black leading-none text-white">{rec.plan.name}</span>
            {option.quantity > 1 && (
              <span className="rounded-pill bg-white/20 px-[10px] py-[4px] text-11 font-extrabold tracking-[0.06em] text-white">
                x{option.quantity}
              </span>
            )}
            {option.shared && (
              <span className="rounded-pill bg-white/20 px-[10px] py-[4px] text-11 font-extrabold tracking-[0.06em] text-white">
                SHARED
              </span>
            )}
          </div>
          <div className="mt-[10px] flex flex-wrap items-baseline gap-x-[12px] gap-y-[4px]">
            <span className="text-d36 font-black leading-none text-white">
              ${option.upfrontCost}
            </span>
            <span className="text-15 font-extrabold text-link-light">
              {option.quantity > 1
                ? `${rec.plan.classes} classes each`
                : `${rec.plan.classes} classes`}
            </span>
          </div>
          <div className="mt-[8px] text-12 font-semibold text-white/80">
            {rec.plan.per} per class · Valid {rec.plan.days} days
            {option.quantity > 1 ? ` · $${rec.plan.price} per plan` : ""}
          </div>

          {/* The headline price is one purchase; this is what it costs to keep
              going at the cadence they chose, which is the number that matters. */}
          <div className="mt-[16px] border-t border-white/25 pt-[14px]">
            <span className="text-d24 font-black leading-none text-white">
              ${rec.monthlyCost}
            </span>
            <span className="ml-[8px] text-13 font-bold text-link-light">
              a month at this pace
            </span>
          </div>

          <Link
            href="/contact/"
            className="mt-[18px] inline-block rounded-[14px] bg-white px-[24px] py-[12px] text-12_5 font-extrabold tracking-[0.03em] text-link-hover shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:bg-surface-alt hover:text-link-hover"
          >
            Submit an inquiry
          </Link>
        </div>

        {rec.reasons.length > 0 && (
          <div className="mt-[14px] flex flex-wrap gap-[8px]">
            {rec.reasons.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-[7px] rounded-pill border border-[#C9E9FB] bg-[#EAF7FE] px-[12px] py-[6px] text-12 font-bold text-link-hover"
              >
                <span className="font-extrabold text-primary">✓</span>
                {c}
              </span>
            ))}
          </div>
        )}

        {rec.note && (
          <div className="mt-[12px] rounded-[12px] border border-border bg-surface-alt px-[16px] py-[12px]">
            <span className="text-12 font-extrabold text-body">Worth knowing: </span>
            <span className="text-12_5 leading-[1.65] text-muted">{rec.note}</span>
            {rec.suggestedPerWeek && rec.suggestedPerWeek <= MAX_PER_WEEK && (
              <button
                type="button"
                onClick={() => setSpw(rec.suggestedPerWeek as number)}
                className="mt-[10px] block cursor-pointer rounded-[10px] border border-border bg-white px-[12px] py-[8px] text-12 font-extrabold text-link-hover hover:border-link-light-3 hover:bg-link-light"
              >
                Try {rec.suggestedPerWeek} classes a week →
              </button>
            )}
          </div>
        )}

        {/* Sibling sharing is not automatically the cheaper route, so show the
            road not taken rather than asking them to take it on trust. */}
        {alternative && (
          <p className="mt-[12px] text-12_5 leading-[1.7] text-muted">
            <span className="font-extrabold text-body">The other way: </span>
            {optionLabel(alternative)} — ${alternative.upfrontCost} up front, about $
            {alternative.monthlyCost} a month
            {alternative.expiresUnused
              ? `, but roughly ${alternative.plan.classes - alternative.usableClasses} of its ${alternative.plan.classes} classes would expire unused.`
              : "."}
          </p>
        )}

        {rec.renewalNote && (
          <p className="mt-[12px] text-13 leading-[1.7] text-muted">{rec.renewalNote}</p>
        )}

        <p className="mt-[12px] text-12 leading-[1.6] text-muted-3">
          An estimate to start the conversation — we confirm the right plan with you before you
          pay anything.
        </p>
      </div>
    </div>
  );
}
