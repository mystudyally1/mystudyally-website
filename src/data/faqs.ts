// GENERATED from "website design/FAQ.dc.html".

export interface FaqEntry {
  id: string;
  q: string;
  a: string;
  linkLabel?: string;
  linkHref?: string;
}

export interface FaqGroup {
  id: string;
  label: string;
  items: FaqEntry[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    "id": "how-it-works",
    "label": "How it works",
    "items": [
      {
        "id": "how-matching",
        "q": "How does matching work?",
        "a": "You submit an inquiry with your curriculum, subjects, and grade level. Our team reviews it and matches you with a tutor who specialises in that exact exam board — we don't hand you a directory to search.",
        "linkLabel": "See how matching works on an IGCSE level",
        "linkHref": "/igcse/"
      },
      {
        "id": "matching-time",
        "q": "How long does matching take?",
        "a": "We reply to every inquiry within 24 hours. Matching itself usually follows within 24 hours once we know your subjects and schedule."
      },
      {
        "id": "curricula-covered",
        "q": "Which curricula do you cover?",
        "a": "We have tutors placed for IGCSE, GCSE, A Levels, IB, SABIS, HKDSE, and the American curriculum, plus IELTS and SAT preparation. If your curriculum isn't listed, tell us anyway — our network is wider than what's published.",
        "linkLabel": "Browse all curricula",
        "linkHref": "/subjects/"
      }
    ]
  },
  {
    "id": "pricing-and-payments",
    "label": "Pricing and payments",
    "items": [
      {
        "id": "how-pricing-works",
        "q": "How does pricing work?",
        "a": "You buy a prepaid plan of classes — from 4 up to 32 — and classes are deducted as sessions are completed. There are no registration or platform fees; the plan price is all you pay.",
        "linkLabel": "See all six plans",
        "linkHref": "/pricing/"
      },
      {
        "id": "free-trial",
        "q": "Is the trial really free?",
        "a": "Yes. Thirty minutes, no card, no obligation. We match you with a tutor first so the trial is with the person who would actually teach your child."
      },
      {
        "id": "how-to-pay",
        "q": "How do I pay?",
        "a": "Once you're ready to enrol, our team sends a secure payment link directly. Your classes are added to your account the moment payment clears.",
        "linkLabel": "See how enrolment works",
        "linkHref": "/pricing/"
      },
      {
        "id": "hours-expiry",
        "q": "What happens to classes I don't use?",
        "a": "Plans carry a validity window — 30 days on the smaller plans, 45 and 60 days on Premium and Complete. Exact expiry and rollover terms are being finalised before we publish them.",
        "linkLabel": "See plan validity",
        "linkHref": "/pricing/"
      },
      {
        "id": "switch-plan",
        "q": "Can I switch plans later?",
        "a": "Plans are designed as a ladder, so moving up between cycles is straightforward. The terms for switching mid-cycle are being finalised."
      },
      {
        "id": "refunds",
        "q": "Can I get a refund or cancel?",
        "a": "Refund and cancellation terms are being finalised. Until they're published, our team will confirm them with you in writing before you pay anything."
      }
    ]
  },
  {
    "id": "scheduling",
    "label": "Scheduling",
    "items": [
      {
        "id": "how-sessions-run",
        "q": "How are sessions conducted?",
        "a": "All sessions run over Zoom, one-to-one, and are recorded automatically so your child can rewatch anything they missed."
      },
      {
        "id": "reschedule",
        "q": "Can I reschedule a session?",
        "a": "Yes — scheduling changes go through our admin team. Message us from your dashboard or contact us directly and we'll move it.",
        "linkLabel": "Contact the team",
        "linkHref": "/contact/"
      },
      {
        "id": "missed-session",
        "q": "What if my child misses a session?",
        "a": "Notice periods and whether a missed class is deducted are covered by the cancellation policy currently being finalised."
      },
      {
        "id": "tech-requirements",
        "q": "What does my child need to join a session?",
        "a": "A laptop, tablet, or desktop with a webcam, a stable connection of around 5 Mbps, and headphones. No Zoom account is needed — the tutor sends a join link. If a connection drops, the tutor waits and the session time is protected."
      }
    ]
  },
  {
    "id": "tutors",
    "label": "Tutors",
    "items": [
      {
        "id": "tutors-verified",
        "q": "Are tutors verified?",
        "a": "Yes. Every tutor is vetted for the specific curriculum and subjects they teach — exam-board experience, subject depth, and a teaching assessment — before they take a single session.",
        "linkLabel": "Read how we vet tutors",
        "linkHref": "/about/"
      },
      {
        "id": "contact-tutor",
        "q": "Can I contact a tutor directly?",
        "a": "All communication and scheduling goes through MyStudyAlly. It keeps sessions organised and means every interaction is recorded and accountable."
      },
      {
        "id": "safeguarding",
        "q": "Is my child safe in a one-to-one session?",
        "a": "Sessions are recorded by default, tutors are verified before placement, and parents can access every recording from the dashboard. Our full safeguarding policy — including who can access recordings and how long they're kept — is being documented."
      }
    ]
  },
  {
    "id": "account-and-access",
    "label": "Account and access",
    "items": [
      {
        "id": "need-account",
        "q": "Do I need an account to submit an inquiry?",
        "a": "No. Inquiries are open to anyone. An account is created once you're matched and ready to begin."
      },
      {
        "id": "recordings",
        "q": "How do I access session recordings?",
        "a": "Once your account is set up, every recording is available in your dashboard, listed by session date and subject."
      }
    ]
  }
];
