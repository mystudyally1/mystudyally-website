import { PLANS, PLAN_FINDER, type PlanFinderEntry } from "@/data/pricing";

/**
 * Plan recommendation for the pricing page calculator.
 *
 * The model is built around what the pricing table already says rather than a
 * separate set of rules layered on top:
 *
 *  - Each plan carries a suggested cadence ("Suggested 3x/week"). A plan's
 *    class count divided by its validity window reproduces that cadence, so
 *    "the plan nearest to one month of the household's demand" lands on the
 *    tier the table already positions for it.
 *  - Feature thresholds (2 subjects, multiple subjects, sibling sharing) are
 *    read out of the plan feature lists, so they follow the table if it moves.
 *  - Two children can be served by one shared plan or by a plan each. Both are
 *    costed and the better one wins. Sharing is not automatically the answer:
 *    it only starts at the Premium tier, which at a low cadence means paying
 *    for classes that expire.
 *
 * Cost is quoted per 30 days at the rate the household actually consumes,
 * because the renewal cycle is whichever comes first — running out of classes,
 * or the validity window closing.
 */

const DAYS_PER_MONTH = 30;
const DAYS_PER_WEEK = 7;
const WEEKS_PER_MONTH = DAYS_PER_MONTH / DAYS_PER_WEEK;

/** Smallest plan whose feature list mentions `needle`, as a class count. */
function floorForFeature(needle: string): number {
  return PLANS.find((p) => p.feats.some((f) => f.toLowerCase().includes(needle)))?.classes ?? 0;
}

const TWO_SUBJECT_FLOOR = floorForFeature("up to 2 subjects");
const MANY_SUBJECT_FLOOR = floorForFeature("multiple subjects");
const SIBLING_FLOOR = floorForFeature("sibling sharing");

export interface PlanOption {
  plan: PlanFinderEntry;
  /** 1 for a shared plan, otherwise one per child. */
  quantity: number;
  /** True when a single plan is split across the children. */
  shared: boolean;
  /** Classes each plan supplies per week. */
  perWeekPerPlan: number;
  /** Days to work through one plan at that rate. */
  daysToUse: number;
  /** Real renewal cycle: running out, or expiring, whichever is sooner. */
  cycleDays: number;
  /** Classes reachable before the validity window closes. */
  usableClasses: number;
  expiresUnused: boolean;
  /** Whole household, per 30 days, at the real renewal cycle. */
  monthlyCost: number;
  /** Total up front for one purchase of this option. */
  upfrontCost: number;
}

export interface PlanRecommendation {
  option: PlanOption;
  /** The route not taken, when there is more than one child. */
  alternative: PlanOption | null;
  plan: PlanFinderEntry;
  monthlyCost: number;
  /** Classes consumed per week across the household. */
  totalPerWeek: number;
  reasons: string[];
  /** Cadence that would use the plan fully, when the chosen one would not. */
  suggestedPerWeek: number | null;
  note: string | null;
  renewalNote: string | null;
}

function buildOption(
  plan: PlanFinderEntry,
  quantity: number,
  perWeekPerPlan: number,
  shared: boolean,
): PlanOption {
  const daysToUse = (plan.classes / perWeekPerPlan) * DAYS_PER_WEEK;
  const cycleDays = Math.min(plan.days, daysToUse);
  const usableClasses = Math.min(
    plan.classes,
    Math.floor((perWeekPerPlan * plan.days) / DAYS_PER_WEEK),
  );
  return {
    plan,
    quantity,
    shared,
    perWeekPerPlan,
    daysToUse,
    cycleDays,
    usableClasses,
    expiresUnused: usableClasses < plan.classes,
    monthlyCost: Math.round((plan.price * quantity * DAYS_PER_MONTH) / cycleDays),
    upfrontCost: plan.price * quantity,
  };
}

/** Smallest tier carrying the features this plan has to provide. */
function featureFloor(subjectsPerPlan: number, needsSharing: boolean): number {
  let floor = 0;
  if (subjectsPerPlan === 2) floor = Math.max(floor, TWO_SUBJECT_FLOOR);
  if (subjectsPerPlan >= 3) floor = Math.max(floor, MANY_SUBJECT_FLOOR);
  if (needsSharing) floor = Math.max(floor, SIBLING_FLOOR);
  return floor;
}

function choosePlan(
  perWeekPerPlan: number,
  subjectsPerPlan: number,
  needsSharing: boolean,
): PlanFinderEntry {
  const floor = featureFloor(subjectsPerPlan, needsSharing);
  const eligible = PLAN_FINDER.filter((p) => p.classes >= floor);
  const pool = eligible.length > 0 ? eligible : [PLAN_FINDER[PLAN_FINDER.length - 1]];

  // Nearest to one month of demand. PLAN_FINDER is ascending and the comparison
  // is strict, so a tie settles on the smaller, cheaper plan.
  const demand = perWeekPerPlan * WEEKS_PER_MONTH;
  return pool.reduce((best, p) =>
    Math.abs(p.classes - demand) < Math.abs(best.classes - demand) ? p : best,
  );
}

/** Cadence that consumes a plan within its window, rounded up to whole classes. */
function cadenceThatFits(plan: PlanFinderEntry): number {
  return Math.ceil((plan.classes / plan.days) * DAYS_PER_WEEK);
}

function weeks(days: number): string {
  const w = Math.max(1, Math.round(days / DAYS_PER_WEEK));
  return `${w} ${w === 1 ? "week" : "weeks"}`;
}

function classesLabel(n: number): string {
  return `${n} ${n === 1 ? "class" : "classes"}`;
}

export function recommendPlan(
  children: number,
  subjects: number,
  perWeek: number,
): PlanRecommendation {
  const kids = Math.max(1, children);
  const rate = Math.max(1, perWeek);
  const totalPerWeek = rate * kids;

  // Route A — a plan each, subjects split as evenly as they divide.
  const subjectsEach = Math.max(1, Math.ceil(subjects / kids));
  const separate = buildOption(choosePlan(rate, subjectsEach, false), kids, rate, false);

  // Route B — one plan shared, which requires the sibling-sharing tier.
  const shared =
    kids > 1 ? buildOption(choosePlan(totalPerWeek, subjects, true), 1, totalPerWeek, true) : null;

  // Waste first, then cost. A cheaper plan that expires half-unused is not a
  // better recommendation, it is a worse one that happens to cost less.
  let option = separate;
  let alternative: PlanOption | null = null;
  if (shared) {
    const better =
      shared.expiresUnused !== separate.expiresUnused
        ? shared.expiresUnused
          ? separate
          : shared
        : shared.monthlyCost <= separate.monthlyCost
          ? shared
          : separate;
    option = better;
    alternative = better === shared ? separate : shared;
  }

  const { plan } = option;

  const reasons: string[] = [];
  if (kids > 1) {
    reasons.push(option.shared ? "One plan shared between them" : `One plan each (${kids})`);
  }
  if (!option.expiresUnused) {
    reasons.push(
      `${plan.classes} classes lasts ${weeks(option.cycleDays)} at ${classesLabel(option.perWeekPerPlan)} a week`,
    );
  }
  if (option.shared) reasons.push("Sibling sharing included");
  if (subjects >= 3) reasons.push(`Covers ${subjects >= 4 ? "4+" : subjects} subjects`);
  else if (subjects === 2) reasons.push("Covers 2 subjects");

  // The plan can only exceed what the cadence consumes when a feature floor
  // forced it there. Say what cadence would use it, rather than quietly
  // selling classes that expire.
  let suggestedPerWeek: number | null = null;
  let note: string | null = null;
  if (option.expiresUnused) {
    suggestedPerWeek = cadenceThatFits(plan);
    // "per child" only reads sensibly when there is more than one.
    const scope = kids === 1 ? "" : option.shared ? " across the children" : " per child";
    const because = option.shared ? "sibling sharing" : `${subjects >= 4 ? "4+" : subjects} subjects`;
    note =
      `${plan.name} is the smallest plan that covers ${because}, but at ` +
      `${classesLabel(option.perWeekPerPlan)} a week${scope} only about ${option.usableClasses} of its ` +
      `${plan.classes} classes fit inside the ${plan.days}-day window. About ${suggestedPerWeek} a week ` +
      `uses it fully — or tell us the situation and we'll size it with you.`;
  }

  // Running out well before expiry means renewing mid-window, which belongs in
  // the cost picture up front rather than as a surprise.
  let renewalNote: string | null = null;
  if (!option.expiresUnused && option.cycleDays < plan.days - DAYS_PER_WEEK) {
    renewalNote =
      `At this pace you'd work through ${option.shared ? "the plan" : "each plan"} in about ` +
      `${weeks(option.cycleDays)}, well inside its ${plan.days}-day window, so expect to renew about that often.`;
  }

  return {
    option,
    alternative,
    plan,
    monthlyCost: option.monthlyCost,
    totalPerWeek,
    reasons,
    suggestedPerWeek,
    note,
    renewalNote,
  };
}
