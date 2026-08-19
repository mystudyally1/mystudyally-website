// Rule-based chat assistant: a decision tree, no API and no free-text input.
//
// The tree is a full navigator — every page on the site is reachable from it,
// and every curriculum can be opened directly. Answers are written from the
// same sources the pages render from (pricing.ts, curricula.ts, faqs.ts), so
// they cannot drift from what the site says.
//
// NOTE: the design's ChatWidget.dc.html quoted obsolete pricing ("20 hours at
// $660 ... $33 an hour"), which contradicts the pricing page. The pricing
// answers below are written from src/data/pricing.ts instead. Keep it that way.

export type ChatAction = "inquiry" | "whatsapp" | "email";

export interface ChatNode {
  id: string;
  /** Shown as the tappable chip. */
  question: string;
  answer: string;
  followUps?: string[];
  actions?: ChatAction[];
  /** Deep link offered alongside the answer. */
  link?: { label: string; href: string };
  /** Extra links, e.g. a list of curricula. */
  links?: { label: string; href: string }[];
}

export const CHAT_OPENING =
  "Hi! I can help you find your way around the site, answer questions about curricula, pricing and how we work, or get you to a person. What are you after?";

/** Top-level menu. */
export const CHAT_STARTERS = [
  "browse",
  "how-it-works",
  "pricing",
  "curricula",
  "free-trial",
  "talk-to-someone",
];

export const CHAT_NODES: Record<string, ChatNode> = {
  /* ---------------- navigation ---------------- */
  browse: {
    id: "browse",
    question: "Take me to a page",
    answer: "Here's everything on the site — pick where you'd like to go.",
    links: [
      { label: "Home", href: "/" },
      { label: "Subjects & curricula", href: "/subjects/" },
      { label: "Our tutors", href: "/tutors/" },
      { label: "Pricing", href: "/pricing/" },
      { label: "About us", href: "/about/" },
      { label: "Blog", href: "/blog/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Contact", href: "/contact/" },
    ],
    followUps: ["curricula", "pricing", "how-it-works"],
  },

  curricula: {
    id: "curricula",
    question: "Which curricula do you cover?",
    answer:
      "Ten in total: IGCSE, GCSE, A Levels, IB, SABIS, HKDSE, and the American and Canadian curricula, plus IELTS and SAT preparation. Open any one below.",
    links: [
      { label: "IGCSE", href: "/igcse/" },
      { label: "GCSE", href: "/gcse/" },
      { label: "A Levels", href: "/a-levels/" },
      { label: "IB", href: "/ib/" },
      { label: "SABIS", href: "/sabis/" },
      { label: "HKDSE", href: "/hkdse/" },
      { label: "American Curriculum", href: "/american-curriculum/" },
      { label: "Canadian Curriculum", href: "/canadian-curriculum/" },
      { label: "IELTS", href: "/ielts/" },
      { label: "SAT", href: "/sat/" },
    ],
    followUps: ["subjects", "not-listed", "tutors-vetted"],
    actions: ["inquiry"],
  },

  subjects: {
    id: "subjects",
    question: "Which subjects can you cover?",
    answer:
      "Maths and the sciences, English language and literature, economics, business, accounting, computer science, humanities and languages — the exact list depends on the curriculum.",
    link: { label: "See subjects by curriculum", href: "/subjects/" },
    followUps: ["curricula", "not-listed"],
    actions: ["inquiry"],
  },

  "not-listed": {
    id: "not-listed",
    question: "My subject isn't listed",
    answer:
      "Tell us anyway — our tutor network is wider than what's published on the site. Send us the curriculum and subject and we'll confirm whether we can cover it before you commit to anything.",
    actions: ["inquiry", "whatsapp"],
  },

  /* ---------------- how it works ---------------- */
  "how-it-works": {
    id: "how-it-works",
    question: "How does it work?",
    answer:
      "You tell us the curriculum, subjects and year group. Our team — not an algorithm — matches a tutor who specialises in that exact exam board, and we handle the scheduling. You start with a free 30-minute trial before paying anything.",
    followUps: ["matching-time", "free-trial", "sessions", "tutors-vetted"],
  },

  "matching-time": {
    id: "matching-time",
    question: "How long does matching take?",
    answer:
      "We reply to every inquiry within 24 hours. Matching usually follows within 24 hours of that, once we know your subjects and schedule.",
    followUps: ["free-trial", "payment"],
    actions: ["inquiry"],
  },

  sessions: {
    id: "sessions",
    question: "How do sessions run?",
    answer:
      "One-to-one over Zoom, and every session is recorded automatically so your child can rewatch anything they missed. They need a device with a webcam, a stable connection and headphones — no Zoom account required.",
    followUps: ["recordings", "reschedule", "class-length"],
  },

  recordings: {
    id: "recordings",
    question: "Can we rewatch sessions?",
    answer:
      "Yes — every recording is available in your dashboard once your account is set up, listed by session date and subject.",
    followUps: ["sessions", "account"],
  },

  reschedule: {
    id: "reschedule",
    question: "Can I reschedule a session?",
    answer:
      "Yes — scheduling changes go through our admin team, so there's no back-and-forth with a tutor's calendar. Message us and we'll move it.",
    followUps: ["sessions"],
    actions: ["whatsapp", "email"],
  },

  account: {
    id: "account",
    question: "Do I need an account?",
    answer:
      "Not to send an inquiry — that's open to anyone. An account is created once you're matched and ready to begin, and that's where recordings and your class balance live.",
    followUps: ["how-it-works"],
    link: { label: "Read the full FAQ", href: "/faq/" },
  },

  /* ---------------- tutors ---------------- */
  "tutors-vetted": {
    id: "tutors-vetted",
    question: "Are tutors verified?",
    answer:
      "Yes. We verify qualifications directly, assess each tutor on the specific specification they'll teach, observe a trial session, and run background checks before they take any students.",
    followUps: ["request-tutor", "how-it-works"],
    link: { label: "How we vet tutors", href: "/about/" },
  },

  "request-tutor": {
    id: "request-tutor",
    question: "Can I request a specific tutor?",
    answer:
      "Yes — name them in your inquiry and our team will do its best to match them, subject to availability. You can browse who teaches what first.",
    link: { label: "Meet our tutors", href: "/tutors/" },
    actions: ["inquiry"],
  },

  /* ---------------- pricing ---------------- */
  pricing: {
    id: "pricing",
    question: "How does pricing work?",
    answer:
      "You buy a prepaid plan of classes and they're deducted as sessions happen. Plans run from 4 classes at $45 up to 32 classes at $239 — the per-class rate drops as the plan gets bigger, from $11.25 down to $7.47. Every class is 60 minutes, and there are no registration or platform fees.",
    followUps: ["class-length", "which-plan", "payment", "unused-classes"],
    link: { label: "See all six plans", href: "/pricing/" },
  },

  "which-plan": {
    id: "which-plan",
    question: "Which plan should I pick?",
    answer:
      "It depends on how often you want classes, how many subjects, and whether more than one child is studying. There's a short plan finder on the pricing page that works it out and shows what each plan actually covers.",
    link: { label: "Open the plan finder", href: "/pricing/#find-your-plan" },
    followUps: ["pricing", "free-trial"],
  },

  "class-length": {
    id: "class-length",
    question: "How long is a class?",
    answer: "60 minutes, one-to-one — the same on every plan.",
    followUps: ["pricing", "sessions"],
  },

  payment: {
    id: "payment",
    question: "How do I pay?",
    answer:
      "Once you're ready to enrol, our team sends a secure payment link directly. Your classes are added the moment payment clears — nothing is taken before the free trial.",
    followUps: ["free-trial", "unused-classes"],
    actions: ["inquiry"],
  },

  "unused-classes": {
    id: "unused-classes",
    question: "What happens to classes I don't use?",
    answer:
      "Plans carry a validity window — 30 days on the smaller plans, 45 and 60 days on Premium and Complete. The exact expiry and rollover terms are being finalised, and our team will confirm them with you in writing before you pay anything.",
    followUps: ["pricing"],
    link: { label: "See plan validity", href: "/pricing/" },
  },

  "free-trial": {
    id: "free-trial",
    question: "Is the trial really free?",
    answer:
      "Yes — 30 minutes, no card, no obligation. We match you with a tutor first, so the trial is with the person who would actually teach.",
    followUps: ["how-it-works", "pricing"],
    actions: ["inquiry"],
  },

  /* ---------------- handoff ---------------- */
  "talk-to-someone": {
    id: "talk-to-someone",
    question: "I'd rather talk to a person",
    answer:
      "Of course — every inquiry is read by a person on our team, and we reply within 24 hours. WhatsApp is usually quickest if it's urgent.",
    actions: ["inquiry", "whatsapp", "email"],
    followUps: ["browse"],
  },
};
