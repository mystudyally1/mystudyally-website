// Rule-based chat assistant content — a decision tree, no API and no free-text
// input (a text box that can't answer anything sets an expectation we can't meet).
//
// NOTE: the design's ChatWidget.dc.html quoted obsolete pricing ("20 hours at
// $660 ... $33 an hour"). That contradicts the live pricing page, so the pricing
// answer below is written from src/data/pricing.ts instead. Keep it that way.

export interface ChatNode {
  id: string;
  /** Shown as the tappable question chip. */
  question: string;
  answer: string;
  followUps?: string[];
  /** Terminal nodes offer the two real actions. */
  actions?: ("inquiry" | "whatsapp")[];
  /** Optional deep link shown alongside the answer. */
  link?: { label: string; href: string };
}

export const CHAT_OPENING =
  "Hi! I can help with curricula, subjects, pricing, and how MyStudyAlly works. What would you like to know?";

export const CHAT_STARTERS = [
  "how-it-works",
  "pricing",
  "curricula",
  "free-trial",
  "sessions",
  "talk-to-someone",
];

export const CHAT_NODES: Record<string, ChatNode> = {
  "how-it-works": {
    id: "how-it-works",
    question: "How does it work?",
    answer:
      "You tell us the curriculum, subjects, and year group. Our team — not an algorithm — matches a tutor who specialises in that exact exam board, and we handle scheduling. You start with a free 30-minute trial before paying anything.",
    followUps: ["matching-time", "free-trial", "sessions"],
  },
  "matching-time": {
    id: "matching-time",
    question: "How long does matching take?",
    answer:
      "We reply to every inquiry within 24 hours. Matching usually follows within 24 hours of that, once we know your subjects and schedule.",
    followUps: ["free-trial"],
    actions: ["inquiry"],
  },
  pricing: {
    id: "pricing",
    question: "How does pricing work?",
    answer:
      "You buy a prepaid plan of classes and they're deducted as sessions happen. Plans run from 4 classes at $45 up to 32 classes at $239 — the per-class rate drops as the plan gets bigger, from $11.25 down to $7.47. Every class is 60 minutes, and there are no registration or platform fees.",
    followUps: ["class-length", "free-trial", "payment"],
    link: { label: "See all six plans", href: "/pricing/" },
  },
  "class-length": {
    id: "class-length",
    question: "How long is a class?",
    answer: "60 minutes, one-to-one — the same on every plan.",
    followUps: ["sessions", "pricing"],
  },
  payment: {
    id: "payment",
    question: "How do I pay?",
    answer:
      "Once you're ready to enrol, our team sends a secure payment link directly. Your classes are added the moment payment clears — nothing is taken before the free trial.",
    followUps: ["free-trial"],
    actions: ["inquiry"],
  },
  "free-trial": {
    id: "free-trial",
    question: "Is the trial really free?",
    answer:
      "Yes — 30 minutes, no card, no obligation. We match you with a tutor first, so the trial is with the person who would actually teach.",
    followUps: ["how-it-works", "pricing"],
    actions: ["inquiry"],
  },
  curricula: {
    id: "curricula",
    question: "Which curricula do you cover?",
    answer:
      "IGCSE, GCSE, A Levels, IB, SABIS, HKDSE, and the American and Canadian curricula — plus IELTS and SAT preparation. If yours isn't listed, tell us anyway; our network is wider than what's published.",
    followUps: ["subjects", "tutors-vetted"],
    link: { label: "Browse all curricula", href: "/subjects/" },
  },
  subjects: {
    id: "subjects",
    question: "Which subjects can you cover?",
    answer:
      "Maths and the sciences, English language and literature, economics, business, accounting, computer science, humanities, and languages — the exact list depends on the curriculum.",
    followUps: ["curricula"],
    link: { label: "See subjects by curriculum", href: "/subjects/" },
    actions: ["inquiry"],
  },
  sessions: {
    id: "sessions",
    question: "How do sessions run?",
    answer:
      "One-to-one over Zoom, and every session is recorded automatically so your child can rewatch anything they missed. Your child needs a device with a webcam, a stable connection, and headphones — no Zoom account required.",
    followUps: ["recordings", "reschedule"],
  },
  recordings: {
    id: "recordings",
    question: "Can we rewatch sessions?",
    answer:
      "Yes — every recording is available in your dashboard once your account is set up, listed by session date and subject.",
    followUps: ["sessions"],
  },
  reschedule: {
    id: "reschedule",
    question: "Can I reschedule a session?",
    answer:
      "Yes — scheduling changes go through our admin team, so there's no back-and-forth with a tutor's calendar. Just message us and we'll move it.",
    followUps: ["sessions"],
    actions: ["whatsapp"],
  },
  "tutors-vetted": {
    id: "tutors-vetted",
    question: "Are tutors verified?",
    answer:
      "Yes. We verify qualifications directly, assess each tutor on the specific specification they'll teach, observe a trial session, and run background checks before they take any students.",
    followUps: ["how-it-works"],
    link: { label: "How we vet tutors", href: "/about/" },
  },
  "talk-to-someone": {
    id: "talk-to-someone",
    question: "I'd rather talk to a person",
    answer:
      "Of course — every inquiry is read by a person on our team, and we reply within 24 hours. You can also reach us on WhatsApp if it's quicker.",
    actions: ["inquiry", "whatsapp"],
  },
};
