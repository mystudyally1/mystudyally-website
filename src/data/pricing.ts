// GENERATED from "website design/Pricing v2.dc.html".
// The three [POLICY PENDING] FAQ answers were replaced with the honest
// "being finalised" wording the FAQ page already uses — no policy invented.

export interface Plan {
  tier: string;
  name: string;
  classes: number;
  price: string;
  per: string;
  validity: string;
  cadence: string;
  intro: string | null;
  feats: string[];
  group: number;
}

export const PLANS: Plan[] = [
  {
    "tier": "STARTER",
    "name": "Starter",
    "classes": 4,
    "price": "$45",
    "per": "$11.25 per class",
    "validity": "Valid 30 days",
    "cadence": "Suggested 1×/week",
    "intro": null,
    "feats": [
      "1-to-1 private tutoring",
      "1 subject",
      "Dedicated tutor",
      "Homework support",
      "Study resources",
      "Flexible scheduling"
    ],
    "group": 0
  },
  {
    "tier": "ESSENTIAL",
    "name": "Essential",
    "classes": 8,
    "price": "$79",
    "per": "$9.88 per class",
    "validity": "Valid 30 days",
    "cadence": "Suggested 2×/week",
    "intro": "Everything in Starter, plus —",
    "feats": [
      "Past-paper practice",
      "Progress tracking"
    ],
    "group": 0
  },
  {
    "tier": "PROGRESS",
    "name": "Progress",
    "classes": 12,
    "price": "$105",
    "per": "$8.75 per class",
    "validity": "Valid 30 days",
    "cadence": "Suggested 3×/week",
    "intro": "Everything in Essential, plus —",
    "feats": [
      "Up to 2 subjects",
      "Personalised study plan",
      "Exam strategy",
      "Marking-scheme guidance"
    ],
    "group": 1
  },
  {
    "tier": "ACADEMIC+",
    "name": "Academic+",
    "classes": 16,
    "price": "$135",
    "per": "$8.44 per class",
    "validity": "Valid 30 days",
    "cadence": "Suggested 4×/week",
    "intro": "Everything in Progress, plus —",
    "feats": [
      "Multiple subjects",
      "Subject-specialist tutors",
      "Monthly progress report",
      "Parent progress updates",
      "Priority tutor matching"
    ],
    "group": 1
  },
  {
    "tier": "PREMIUM",
    "name": "Premium",
    "classes": 24,
    "price": "$189",
    "per": "$7.88 per class",
    "validity": "Valid 45 days",
    "cadence": "Best for intensive support",
    "intro": "Everything in Academic+, plus —",
    "feats": [
      "Sibling sharing",
      "Multiple specialist tutors",
      "Priority scheduling",
      "Revision planning",
      "Detailed progress reporting"
    ],
    "group": 2
  },
  {
    "tier": "COMPLETE",
    "name": "Complete",
    "classes": 32,
    "price": "$239",
    "per": "$7.47 per class",
    "validity": "Valid 60 days",
    "cadence": "Best for families",
    "intro": "Everything in Premium, plus —",
    "feats": [
      "Maximum subject flexibility",
      "Priority tutor access",
      "Comprehensive academic planning",
      "Priority support"
    ],
    "group": 2
  }
];

export const PLAN_GROUPS: { label: string; desc: string }[] = [
  {
    "label": "STARTER",
    "desc": "For students who need regular weekly support."
  },
  {
    "label": "ACADEMIC",
    "desc": "For consistent academic support across the month."
  },
  {
    "label": "PREMIUM",
    "desc": "For intensive learning, multiple subjects and families."
  }
];

/** [benefit, minimum class count that includes it] */
export const PLAN_BENEFITS: [string, number][] = [
  [
    "Private 1-to-1 classes",
    4
  ],
  [
    "Flexible scheduling",
    4
  ],
  [
    "Dedicated tutor",
    4
  ],
  [
    "Homework support",
    4
  ],
  [
    "Study resources",
    4
  ],
  [
    "Progress tracking",
    8
  ],
  [
    "Past-paper practice",
    8
  ],
  [
    "Multiple subjects",
    12
  ],
  [
    "Personalised study plan",
    12
  ],
  [
    "Exam strategy",
    12
  ],
  [
    "Parent progress updates",
    16
  ],
  [
    "Priority tutor matching",
    16
  ],
  [
    "Priority scheduling",
    24
  ],
  [
    "Sibling sharing",
    24
  ],
  [
    "Detailed academic reporting",
    24
  ]
];

export const ENROLMENT_STEPS: { n: string; t: string; d: string }[] = [
  {
    "n": "1",
    "t": "Submit an inquiry",
    "d": "Tell us your curriculum and subjects."
  },
  {
    "n": "2",
    "t": "We match your tutor",
    "d": "A vetted tutor is matched and we confirm the details."
  },
  {
    "n": "3",
    "t": "Secure payment link",
    "d": "We send a secure payment link once you're ready to enrol."
  },
  {
    "n": "4",
    "t": "Classes added",
    "d": "Your classes are added to your account the moment payment clears."
  }
];

export const PRICING_FAQS: { q: string; a: string }[] = [
  {
    "q": "Is the trial really free?",
    "a": "Yes. 30 minutes, no card, no obligation."
  },
  {
    "q": "How long is a class?",
    "a": "60 minutes — the same on every plan."
  },
  {
    "q": "Do you charge registration or platform fees?",
    "a": "No. The plan price is the only thing you pay."
  },
  {
    "q": "What happens to classes I don't use?",
    "a": "Plans carry a validity window — 30 days on the smaller plans, 45 and 60 days on Premium and Complete. Exact expiry and rollover terms are being finalised before we publish them."
  },
  {
    "q": "Can I switch plans mid-cycle?",
    "a": "Plans are designed as a ladder, so moving up between cycles is straightforward. The terms for switching mid-cycle are being finalised."
  },
  {
    "q": "Can siblings share one plan?",
    "a": "Sibling sharing is included from the Premium plan upwards. The full terms are being finalised — our team will confirm them with you in writing before you pay anything."
  }
];

export const VALIDITY_LINES: string[] = [
  "4 / 8 / 12 / 16 classes — valid 30 days",
  "24 classes — valid 45 days",
  "32 classes — valid 60 days"
];

export const PRICING_TRUST: string[] = [
  "No registration fees",
  "1-to-1 learning",
  "Flexible scheduling",
  "Specialist tutors"
];

/** Every class is 60 minutes on every plan (from the design's pricing FAQ). */
export const CLASS_DURATION_MINUTES = 60;

export const HIGHLIGHT_PLAN = "Academic+";
