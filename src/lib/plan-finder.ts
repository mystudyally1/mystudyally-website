import { PLAN_FINDER, type PlanFinderEntry } from "@/data/pricing";

/**
 * Plan recommendation.
 *
 * The design's original version compared a "classes per month" figure against
 * plan sizes, which recommended plans that cannot actually deliver the chosen
 * cadence — at 5 classes/week it suggested Premium (24 classes, valid 45 days)
 * when that cadence consumes 32 in the window, and it ignored that two children
 * burn through a shared plan twice as fast.
 *
 * This version works from what a plan can really deliver:
 *   1. classes are consumed at `perWeek × children` per week;
 *   2. a plan only fits if it can be used up inside its own validity window;
 *   3. of the plans that fit, the largest wins — it has the lowest per-class rate;
 *   4. sibling sharing and multi-subject support impose a minimum tier, and if
 *      that tier is bigger than the cadence can consume we say so rather than
 *      quietly recommending classes that would expire.
 */

/** Tier floors come from the plan feature table in the design. */
const MULTI_SUBJECT_FLOOR = 2; // "Up to 2 subjects" — Progress (12 classes)
const MANY_SUBJECT_FLOOR = 3; // "Multiple subjects" — Academic+ (16 classes)
const SIBLING_FLOOR = 4; // "Sibling sharing" — Premium (24 classes)

export interface PlanRecommendation {
  plan: PlanFinderEntry;
  /** Total classes consumed per week across the household. */
  totalPerWeek: number;
  /** How many weeks the plan lasts at that rate. */
  weeksOfCover: number;
  /** Whole weeks of validity the plan carries. */
  weeksValid: number;
  /** True when the plan's classes cannot all be used before it expires. */
  expiresUnused: boolean;
  monthlyCost: number;
  reasons: string[];
  /** Set when a feature requirement forced a larger plan than the cadence needs. */
  note: string | null;
  /** Set when the household could exhaust the plan well before it expires. */
  renewalNote: string | null;
}

const weeksToUse = (plan: PlanFinderEntry, totalPerWeek: number) => plan.classes / totalPerWeek;
const weeksValid = (plan: PlanFinderEntry) => plan.days / 7;

export function recommendPlan(
  children: number,
  subjects: number,
  perWeek: number,
): PlanRecommendation {
  const totalPerWeek = Math.max(1, perWeek * children);

  // Minimum tier the household's shape requires, independent of cadence.
  let floor = 0;
  const reasons: string[] = [];
  if (subjects === 2) floor = Math.max(floor, MULTI_SUBJECT_FLOOR);
  if (subjects >= 3) floor = Math.max(floor, MANY_SUBJECT_FLOOR);
  if (children >= 2) floor = Math.max(floor, SIBLING_FLOOR);

  // Largest plan whose classes can actually be used before it expires.
  let cadenceIdx = 0;
  for (let i = 0; i < PLAN_FINDER.length; i++) {
    if (weeksToUse(PLAN_FINDER[i], totalPerWeek) <= weeksValid(PLAN_FINDER[i]) + 0.01) {
      cadenceIdx = i;
    }
  }

  const index = Math.max(floor, cadenceIdx);
  const plan = PLAN_FINDER[index];
  const cover = weeksToUse(plan, totalPerWeek);
  const valid = weeksValid(plan);
  const expiresUnused = cover > valid + 0.01;

  const weekLabel = (n: number) => `${Math.floor(n)} ${Math.floor(n) === 1 ? "week" : "weeks"}`;

  if (index === cadenceIdx && !expiresUnused) {
    reasons.push(
      `${plan.classes} classes covers about ${weekLabel(cover)} at ${totalPerWeek} a week`,
    );
  }
  if (children >= 2) reasons.push("Sibling sharing starts at Premium");
  if (subjects >= 3) reasons.push("Three or more subjects need Academic+ or above");
  else if (subjects === 2) reasons.push("Two subjects need Progress or above");

  let note: string | null = null;
  if (expiresUnused) {
    const usable = Math.floor(totalPerWeek * valid);
    note =
      `At ${totalPerWeek} ${totalPerWeek === 1 ? "class" : "classes"} a week you would use about ` +
      `${usable} of these ${plan.classes} classes before the ${plan.days}-day window closes. ` +
      (children >= 2
        ? "Sibling sharing only starts on Premium, so this is the smallest plan that allows it — "
        : "This is the smallest plan that covers your subjects — ") +
      "either book a little more often, or talk to us and we'll confirm the right fit before you pay.";
  }

  // Flag when they will burn through the plan long before it expires, so a
  // renewal is part of the real cost picture.
  let renewalNote: string | null = null;
  if (!expiresUnused && cover < valid - 1.5) {
    renewalNote =
      `You would finish these ${plan.classes} classes in about ${weekLabel(cover)}, ` +
      `inside the ${plan.days}-day window — so expect to renew roughly every ${weekLabel(cover)}.`;
  }

  return {
    plan,
    totalPerWeek,
    weeksOfCover: cover,
    weeksValid: valid,
    expiresUnused,
    monthlyCost: Math.round(plan.price / (plan.days / 30)),
    reasons,
    note,
    renewalNote,
  };
}
