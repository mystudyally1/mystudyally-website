"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { PLAN_FINDER } from "@/data/pricing";

// Recommendation logic ported verbatim from "website design/Pricing v2.dc.html".
export function PlanFinder() {
  const [kids, setKids] = useState(1);
  const [subj, setSubj] = useState(1);
  const [spw, setSpw] = useState(2);

  const monthly = Math.ceil(spw * 4.33);
  const freqIdx =
    monthly <= 4 ? 0 : monthly <= 8 ? 1 : monthly <= 12 ? 2 : monthly <= 16 ? 3 : monthly <= 24 ? 4 : 5;
  const subjIdx = subj === 1 ? 0 : subj === 2 ? 2 : 3;
  const sibIdx = kids === 1 ? 0 : 4;
  const recIdx = Math.max(freqIdx, subjIdx, sibIdx);
  const rec = PLAN_FINDER[recIdx];

  const chips: string[] = [];
  if (freqIdx === recIdx) chips.push(`Covers ${monthly} classes a month at ${spw}/week`);
  if (subjIdx === recIdx && subjIdx > 0) {
    chips.push(
      `${subj === 4 ? "4+" : subj} subjects need the ${PLAN_FINDER[subjIdx].name} tier or above`,
    );
  }
  if (sibIdx === recIdx && sibIdx > 0) chips.push("Sibling sharing starts at Premium");

  let warmNote: string | null = null;
  if (sibIdx === recIdx && sibIdx > freqIdx) {
    warmNote =
      `${kids === 2 ? "Two children" : "Three or more children"} means you'll want sibling sharing, ` +
      `which starts with Premium — that's more classes than your schedule strictly needs, but they're ` +
      `shared across ${kids === 2 ? "both" : "all"} children and the per-class rate drops to $7.88.`;
  } else if (subjIdx === recIdx && subjIdx > freqIdx) {
    warmNote =
      `Covering ${subj === 4 ? "4 or more" : subj} subjects takes more classes than your weekly schedule ` +
      `strictly needs — ${rec.name} gives each subject room to breathe, and the per-class rate drops to ${rec.per}.`;
  }

  let validityNote: string | null = null;
  if (rec.classes / (rec.days / 7) > spw) {
    const months = Math.ceil(rec.classes / monthly);
    let si = 0;
    for (let i = 0; i < PLAN_FINDER.length; i++) {
      if (PLAN_FINDER[i].classes / (PLAN_FINDER[i].days / 7) <= spw) si = i;
    }
    const sp = PLAN_FINDER[si];
    validityNote =
      `At ${spw} ${spw === 1 ? "class" : "classes"} a week, you'd need about ${months} months to use all ` +
      `${rec.classes} classes, but this plan is valid for ${rec.days} days. We'd suggest ${sp.name}, ` +
      `renewed each month — about $${sp.price * months} over ${months} months.`;
  }

  const seg = (
    options: { label: string; value: number }[],
    current: number,
    set: (v: number) => void,
  ) => (
    <div className="flex gap-[8px]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => set(o.value)}
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
          )}
        </div>
        <div>
          <div className="mb-[9px] flex items-baseline justify-between">
            <span className="text-13 font-extrabold">How often do you want classes?</span>
            <span className="text-13 font-extrabold text-link-hover">{spw}×/week</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={spw}
            onChange={(e) => setSpw(Number(e.target.value))}
            aria-label="Classes per week"
            className="w-full cursor-pointer accent-primary"
          />
          <div className="mt-[6px] text-12 font-bold text-primary-shadow">
            ≈ {monthly} classes a month
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-[16px] border border-link-hover bg-link p-[26px] px-[28px] shadow-[0_14px_32px_rgba(28,176,246,0.30)]">
          <div className="text-11 font-extrabold tracking-[0.14em] text-link-light">
            OUR RECOMMENDATION
          </div>
          <div className="mt-[12px] flex flex-wrap items-baseline gap-[14px]">
            <span className="text-d30 font-black leading-none text-white">{rec.name}</span>
            <span className="text-d36 font-black leading-none text-white">${rec.price}</span>
            <span className="text-15 font-extrabold text-link-light">{rec.classes} classes</span>
          </div>
          <div className="mt-[8px] text-12 font-semibold text-white/80">
            {rec.per} per class · Valid {rec.days} days
          </div>
          <Link
            href="/contact/"
            className="mt-[18px] inline-block rounded-[14px] bg-white px-[24px] py-[12px] text-12_5 font-extrabold tracking-[0.03em] text-link-hover shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:bg-surface-alt hover:text-link-hover"
          >
            Submit an inquiry
          </Link>
        </div>

        {chips.length > 0 && (
          <div className="mt-[14px] flex flex-wrap gap-[8px]">
            {chips.map((c) => (
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

        {warmNote && <p className="mt-[12px] text-13 leading-[1.7] text-muted">{warmNote}</p>}

        {validityNote && (
          <div className="mt-[12px] rounded-[12px] border border-border bg-surface-alt px-[16px] py-[12px]">
            <span className="text-12 font-extrabold text-body">A note on timing: </span>
            <span className="text-12_5 leading-[1.65] text-muted">{validityNote}</span>
          </div>
        )}

        <p className="mt-[12px] text-12 font-bold text-muted-3">
          About ${Math.round(rec.price / (rec.days / 30))} a month
        </p>
      </div>
    </div>
  );
}
