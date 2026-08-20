// GENERATED from the Claude Design export files (see "website design/").
// Placeholder copy the design carried — "[confirm before publishing]" notes and
// the invented testimonial quotes — has been stripped rather than shipped.
// Testimonials are deliberately absent until real ones exist.

export interface CurriculumPageTutor {
  photoId: string;
  name: string;
  qual: string;
  years: string;
  subjects?: string[];
  boards?: string;
  expertise?: string;
}

export interface CurriculumPageSubject {
  name: string;
  code: string | null;
  blurb: string;
}

export interface CurriculumPageFaq {
  q: string;
  a: string;
  link?: boolean;
}

export interface CurriculumPageContent {
  hero: { eyebrow: string; h1: string; sub: string };
  headings: { why: string | null; subjects: string | null };
  trust: string[];
  steps: { num: string; title: string; body: string }[];
  tutors: CurriculumPageTutor[];
  pillars: { num: string; title: string; body: string }[];
  subjects: CurriculumPageSubject[];
  faqs: CurriculumPageFaq[];
  quick: CurriculumPageFaq[];
}

export const CURRICULUM_PAGES: Record<string, CurriculumPageContent> = {
    "igcse": {
      "hero": {
        "eyebrow": "IGCSE TUTORING",
        "h1": "IGCSE Tutoring That Knows the Syllabus, Not Just the Subject",
        "sub": "One-to-one tutoring matched to the exact IGCSE exam board your child is studying — Cambridge or Edexcel — across 11 subjects."
      },
      "headings": {
        "why": "Why IGCSE tutoring is different here",
        "subjects": "Subjects we cover for IGCSE"
      },
      "trust": [
        "Vetted, curriculum-matched tutors",
        "Every session recorded",
        "Free trial, no card required"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-sarah",
          "name": "Sarah A.",
          "qual": "M.Sc. Mathematics",
          "years": "8 years teaching",
          "subjects": [
            "Mathematics",
            "Additional Mathematics"
          ],
          "boards": "Cambridge & Edexcel"
        },
        {
          "photoId": "tutor-photo-omar",
          "name": "Omar K.",
          "qual": "B.Eng., PGCE",
          "years": "6 years teaching",
          "subjects": [
            "Physics",
            "Chemistry"
          ],
          "boards": "Cambridge & Edexcel"
        },
        {
          "photoId": "tutor-photo-hira",
          "name": "Hira M.",
          "qual": "M.Phil. Chemistry",
          "years": "9 years teaching",
          "subjects": [
            "Chemistry",
            "Combined Science"
          ],
          "boards": "Cambridge"
        },
        {
          "photoId": "tutor-photo-fatima",
          "name": "Fatima S.",
          "qual": "M.Ed. Biology",
          "years": "12 years teaching",
          "subjects": [
            "Biology",
            "Combined Science"
          ],
          "boards": "Cambridge & Edexcel"
        },
        {
          "photoId": "tutor-photo-zara",
          "name": "Zara Q.",
          "qual": "B.A. Business Studies",
          "years": "5 years teaching",
          "subjects": [
            "Business Studies",
            "Economics"
          ],
          "boards": "Cambridge"
        },
        {
          "photoId": "tutor-photo-adeel",
          "name": "Adeel R.",
          "qual": "M.A. Geography",
          "years": "6 years teaching",
          "subjects": [
            "Geography",
            "Global Perspectives"
          ],
          "boards": "Cambridge"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "Exam board precision.",
          "body": "Your tutor is matched to whether you're studying Cambridge or Edexcel IGCSE specifically — the syllabuses aren't interchangeable, and neither is good tutoring for them."
        },
        {
          "num": "02",
          "title": "Two-year continuity.",
          "body": "IGCSE spans Year 10 and 11 — we support the same student with the same tutor across both years where possible, so progress compounds instead of restarting."
        },
        {
          "num": "03",
          "title": "Every session recorded.",
          "body": "Revisit a tricky topic the week before a mock exam without waiting for your next session."
        }
      ],
      "subjects": [
        {
          "name": "Mathematics",
          "code": "0580",
          "blurb": "Algebra, geometry, statistics, and exam technique across Core and Extended tiers."
        },
        {
          "name": "Additional Mathematics",
          "code": "0606",
          "blurb": "For students taking Maths and Add Maths together, building toward A Level readiness."
        },
        {
          "name": "Physics",
          "code": "0625",
          "blurb": "Mechanics, electricity, waves, and practical-based exam questions."
        },
        {
          "name": "Chemistry",
          "code": "0620",
          "blurb": "Atomic structure, reactions, and the calculation-heavy sections that trip up most students."
        },
        {
          "name": "Biology",
          "code": "0610",
          "blurb": "Cell biology, human systems, ecology, and exam-style data interpretation."
        },
        {
          "name": "English Language",
          "code": "0500",
          "blurb": "Comprehension, analytical writing, and exam technique under time pressure."
        },
        {
          "name": "English Literature",
          "code": "0475",
          "blurb": "Set texts, close reading, and essay structure for unseen and set-text questions."
        },
        {
          "name": "Economics",
          "code": "0455",
          "blurb": "Micro and macro fundamentals, built for a first exposure to formal economics."
        },
        {
          "name": "Business Studies",
          "code": "0450",
          "blurb": "Core business concepts with an emphasis on applied, scenario-based exam questions."
        },
        {
          "name": "Accounting",
          "code": "0452",
          "blurb": "Double-entry bookkeeping through to financial statement preparation."
        },
        {
          "name": "Computer Science",
          "code": "0478",
          "blurb": "Programming fundamentals, algorithms, and theory paper preparation."
        }
      ],
      "faqs": [
        {
          "q": "My school follows Cambridge, not Edexcel — does that matter?",
          "a": "Yes, and we match accordingly — the two boards differ in syllabus structure and exam format, so your tutor is selected for the specific one you're sitting."
        },
        {
          "q": "Can one tutor cover multiple IGCSE subjects?",
          "a": "Sometimes, if a tutor is qualified across related subjects (e.g. Maths and Add Maths) — mention this in your inquiry."
        },
        {
          "q": "When should we start tutoring before exams?",
          "a": "Earlier is better for building foundations, but focused exam-technique tutoring can still add real value even a few months out — tell us your timeline and we'll advise."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation. It's a chance to meet your tutor before committing to a package."
        }
      ],
      "quick": [
        {
          "q": "Does it matter if my school follows Cambridge or Edexcel?",
          "a": "Yes — the two boards differ in syllabus and exam format, and we match your tutor accordingly, so mention which one applies when you inquire."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    },
    "gcse": {
      "hero": {
        "eyebrow": "GCSE TUTORING",
        "h1": "GCSE Tutoring Built Around UK Exam Boards",
        "sub": "One-to-one support across AQA, Edexcel, and OCR — matched to the specification your school actually teaches."
      },
      "headings": {
        "why": "Why GCSE tutoring is different here",
        "subjects": "Subjects we cover for GCSE"
      },
      "trust": [
        "Vetted, board-matched tutors",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-sarah",
          "name": "Sarah A.",
          "qual": "M.Sc. Mathematics",
          "years": "8 years teaching",
          "subjects": [
            "Mathematics (Foundation & Higher)"
          ],
          "boards": "AQA, Edexcel & OCR"
        },
        {
          "photoId": "tutor-photo-nadia",
          "name": "Nadia R.",
          "qual": "M.A. English Literature",
          "years": "10 years teaching",
          "subjects": [
            "English Language",
            "English Literature"
          ],
          "boards": "AQA & Edexcel"
        },
        {
          "photoId": "tutor-photo-omar",
          "name": "Omar K.",
          "qual": "B.Eng., PGCE",
          "years": "6 years teaching",
          "subjects": [
            "Physics",
            "Chemistry"
          ],
          "boards": "AQA & Edexcel"
        },
        {
          "photoId": "tutor-photo-fatima",
          "name": "Fatima S.",
          "qual": "M.Ed. Biology",
          "years": "12 years teaching",
          "subjects": [
            "Biology",
            "Combined Science"
          ],
          "boards": "AQA & OCR"
        },
        {
          "photoId": "tutor-photo-james",
          "name": "James T.",
          "qual": "B.Sc. Computer Science",
          "years": "5 years teaching",
          "subjects": [
            "Computer Science"
          ],
          "boards": "AQA & OCR"
        },
        {
          "photoId": "tutor-photo-adeel",
          "name": "Adeel R.",
          "qual": "M.A. Geography",
          "years": "6 years teaching",
          "subjects": [
            "Geography"
          ],
          "boards": "AQA & Edexcel"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "Board-matched tutoring",
          "body": "We ask which exam board your school follows and match a tutor familiar with that specific specification, not a generic GCSE overview."
        },
        {
          "num": "02",
          "title": "Coursework & NEA support",
          "body": "Where a subject includes a non-exam component, your tutor helps with that too — not just final exam prep."
        },
        {
          "num": "03",
          "title": "Structured toward Year 11 targets",
          "body": "Sessions build progressively from Year 10 foundations through to Year 11 exam readiness, rather than treating every session as isolated revision."
        }
      ],
      "subjects": [
        {
          "name": "Mathematics",
          "code": "8300",
          "blurb": "Number, algebra, geometry, and statistics across Foundation and Higher tiers."
        },
        {
          "name": "English Language",
          "code": "8700",
          "blurb": "Non-fiction analysis, creative writing, and spoken language components."
        },
        {
          "name": "English Literature",
          "code": "8702",
          "blurb": "Set texts (poetry anthology, prose, drama) and unseen analysis."
        },
        {
          "name": "Biology",
          "code": "8461",
          "blurb": "Cell biology, organisation, and required-practical exam questions."
        },
        {
          "name": "Chemistry",
          "code": "8462",
          "blurb": "Atomic structure, bonding, and quantitative chemistry."
        },
        {
          "name": "Physics",
          "code": "8463",
          "blurb": "Energy, forces, waves, and electricity with practical-based questions."
        },
        {
          "name": "Combined Science",
          "code": "8464",
          "blurb": "The double-award pathway covering all three sciences at a condensed depth."
        },
        {
          "name": "Geography",
          "code": "8035",
          "blurb": "Physical and human geography with case-study-based exam answers."
        },
        {
          "name": "History",
          "code": "8145",
          "blurb": "Depth studies and thematic units, built around your exam board's specific period choices."
        },
        {
          "name": "Business Studies",
          "code": "8132",
          "blurb": "Business operations, marketing, and finance basics with applied exam scenarios."
        },
        {
          "name": "Economics",
          "code": "8136",
          "blurb": "Core micro and macro concepts introduced at GCSE level."
        },
        {
          "name": "Computer Science",
          "code": "8525",
          "blurb": "Programming, computational thinking, and theory paper preparation."
        },
        {
          "name": "French",
          "code": "8652",
          "blurb": "Speaking, listening, reading, and writing across all four assessed skills."
        }
      ],
      "faqs": [
        {
          "q": "Does it matter which exam board my school uses?",
          "a": "Yes — the boards differ in structure, content emphasis, and question style. Your tutor is matched to your specific board."
        },
        {
          "q": "Do you help with GCSE coursework or non-exam assessment?",
          "a": "Yes, where the subject includes one — mention this in your inquiry so we match a tutor experienced with that specific component."
        },
        {
          "q": "Can tutoring help move someone from Foundation to Higher tier?",
          "a": "This depends on the individual student — your tutor can assess this honestly in early sessions and advise directly."
        },
        {
          "q": "Is Combined Science or Triple Science tutoring different?",
          "a": "Yes — Combined Science covers all three sciences at a condensed depth as a double award, while Triple Science students take each science as a separate GCSE. Mention which pathway your school follows."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": [
        {
          "q": "Does it matter which exam board my school uses?",
          "a": "Yes — AQA, Edexcel, and OCR differ enough in structure and content emphasis that board-specific preparation makes a real difference, especially in Sciences and English. Mention your board when you inquire."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    },
    "a-levels": {
      "hero": {
        "eyebrow": "A LEVEL TUTORING",
        "h1": "A Level Tutoring for the Subjects That Decide University Offers",
        "sub": "Focused, subject-intensive support for the 3–4 A Levels that matter most to where you're headed next."
      },
      "headings": {
        "why": "Why A Level tutoring is different here",
        "subjects": "Subjects we cover for A Levels"
      },
      "trust": [
        "Genuine subject specialists",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-sarah",
          "name": "Sarah A.",
          "qual": "M.Sc. Mathematics",
          "years": "8 years teaching",
          "subjects": [
            "Mathematics",
            "Further Mathematics"
          ],
          "boards": "AQA, Edexcel & OCR"
        },
        {
          "photoId": "tutor-photo-yusuf",
          "name": "Yusuf M.",
          "qual": "M.Sc. Applied Mathematics",
          "years": "8 years teaching",
          "subjects": [
            "Mathematics",
            "Further Mathematics"
          ],
          "boards": "Edexcel & MEI"
        },
        {
          "photoId": "tutor-photo-bilal",
          "name": "Bilal H.",
          "qual": "M.Sc. Physics",
          "years": "7 years teaching",
          "subjects": [
            "Physics"
          ],
          "boards": "AQA & OCR"
        },
        {
          "photoId": "tutor-photo-daniel",
          "name": "Daniel L.",
          "qual": "B.Sc. Economics",
          "years": "7 years teaching",
          "subjects": [
            "Economics"
          ],
          "boards": "Edexcel & AQA"
        },
        {
          "photoId": "tutor-photo-zara",
          "name": "Zara Q.",
          "qual": "B.A. Business Studies",
          "years": "5 years teaching",
          "subjects": [
            "Business Studies"
          ],
          "boards": "Edexcel & AQA"
        },
        {
          "photoId": "tutor-photo-james",
          "name": "James T.",
          "qual": "B.Sc. Computer Science",
          "years": "5 years teaching",
          "subjects": [
            "Computer Science"
          ],
          "boards": "AQA & OCR"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "Subject specialists, not generalists",
          "body": "A Level tutors are matched for deep subject expertise — the level of understanding required here is closer to undergraduate foundations than GCSE recall."
        },
        {
          "num": "02",
          "title": "University-outcome awareness",
          "body": "Your tutor understands what strong A Level grades need to look like for competitive university offers, not just what passes the exam."
        },
        {
          "num": "03",
          "title": "Two-year support",
          "body": "AS and A2 content builds directly on each other — we aim to keep the same tutor across both years for continuity."
        }
      ],
      "subjects": [
        {
          "name": "Mathematics",
          "code": "9709",
          "blurb": "Pure maths, statistics, and mechanics across the full A Level specification."
        },
        {
          "name": "Further Mathematics",
          "code": "9231",
          "blurb": "For students taking both Maths and Further Maths, covering the additional pure and applied content."
        },
        {
          "name": "Physics",
          "code": "9702",
          "blurb": "Mechanics, fields, quantum physics, and the mathematical rigor A Level demands."
        },
        {
          "name": "Chemistry",
          "code": "9701",
          "blurb": "Organic, inorganic, and physical chemistry with calculation-heavy exam questions."
        },
        {
          "name": "Biology",
          "code": "9700",
          "blurb": "Molecular biology, genetics, and ecology at degree-adjacent depth."
        },
        {
          "name": "Economics",
          "code": "9708",
          "blurb": "Micro and macroeconomic theory with data-response and essay-based assessment."
        },
        {
          "name": "Business Studies",
          "code": "9609",
          "blurb": "Strategic decision-making and case-study analysis at A Level depth."
        },
        {
          "name": "Accounting",
          "code": "9706",
          "blurb": "Financial and management accounting through to full statement preparation."
        },
        {
          "name": "Computer Science",
          "code": "9618",
          "blurb": "Programming paradigms, computational theory, and a substantial coursework project."
        },
        {
          "name": "English Literature",
          "code": "9695",
          "blurb": "Comparative analysis across set texts, with a strong essay-writing focus."
        },
        {
          "name": "Psychology",
          "code": "9990",
          "blurb": "Research methods and core psychological approaches, exam-assessed."
        },
        {
          "name": "Sociology",
          "code": "9699",
          "blurb": "Theoretical perspectives and methodology across core sociological topics."
        },
        {
          "name": "Geography",
          "code": "9696",
          "blurb": "Physical and human geography with independent investigation coursework."
        },
        {
          "name": "History",
          "code": "9489",
          "blurb": "In-depth historical analysis and extended essay-based assessment."
        },
        {
          "name": "Law",
          "code": "9084",
          "blurb": "Legal principles and case-based analysis, often a first exposure to legal reasoning."
        }
      ],
      "faqs": [
        {
          "q": "Should tutoring start in Year 12 or wait until Year 13?",
          "a": "Starting in Year 12 builds a stronger foundation for the harder Year 13 content — but Year 13-focused exam tutoring is still effective if you're starting later."
        },
        {
          "q": "Do you support retakes?",
          "a": "Yes — mention this in your inquiry so we can match a tutor experienced with retake preparation specifically."
        },
        {
          "q": "Can a tutor help with university-application-related subject knowledge, not just exam grades?",
          "a": "Some tutors can support this depending on subject and background — raise it directly in your inquiry."
        },
        {
          "q": "My child is taking Further Maths alongside Maths — can one tutor cover both?",
          "a": "Often yes, if the tutor is qualified across both — mention this specifically when you inquire so we match accordingly."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": [
        {
          "q": "Will my tutor genuinely know this subject at A Level depth, not just GCSE?",
          "a": "Yes — A Level tutors are matched specifically for subject depth, not general subject familiarity carried over from teaching younger students."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    },
    "ib": {
      "hero": {
        "eyebrow": "IB DIPLOMA TUTORING",
        "h1": "IB Diploma Tutoring Across HL, SL, and the Core",
        "sub": "Support for the six subject groups, the Extended Essay, and Theory of Knowledge — the full breadth the IB actually demands."
      },
      "headings": {
        "why": "Why IB tutoring is different here",
        "subjects": "Subjects we cover for IB"
      },
      "trust": [
        "HL/SL-matched specialists",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-yusuf",
          "name": "Yusuf M.",
          "qual": "M.Sc. Applied Mathematics",
          "years": "8 years teaching",
          "subjects": [
            "Math AA",
            "Math AI"
          ],
          "boards": "HL & SL, IA support"
        },
        {
          "photoId": "tutor-photo-nadia",
          "name": "Nadia R.",
          "qual": "M.A. English Literature",
          "years": "10 years teaching",
          "subjects": [
            "English A: Literature",
            "TOK / EE support"
          ],
          "boards": "HL & SL, DP Core"
        },
        {
          "photoId": "tutor-photo-hira",
          "name": "Hira M.",
          "qual": "M.Phil. Chemistry",
          "years": "9 years teaching",
          "subjects": [
            "Chemistry"
          ],
          "boards": "HL & SL, IA support"
        },
        {
          "photoId": "tutor-photo-bilal",
          "name": "Bilal H.",
          "qual": "M.Sc. Physics",
          "years": "7 years teaching",
          "subjects": [
            "Physics"
          ],
          "boards": "HL & SL, IA support"
        },
        {
          "photoId": "tutor-photo-hassan",
          "name": "Hassan D.",
          "qual": "B.Sc. Biology",
          "years": "5 years teaching",
          "subjects": [
            "Biology"
          ],
          "boards": "HL & SL, IA support"
        },
        {
          "photoId": "tutor-photo-priya",
          "name": "Priya N.",
          "qual": "M.A. Economics",
          "years": "7 years teaching",
          "subjects": [
            "Economics"
          ],
          "boards": "HL & SL"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "HL and SL matched precisely",
          "body": "Higher Level and Standard Level content differ substantially in depth — your tutor is matched to the specific level you're taking, not just the subject name."
        },
        {
          "num": "02",
          "title": "IA and Extended Essay support",
          "body": "These components carry real weight in final grades and need a different kind of guidance than exam prep — we treat them as a distinct focus area."
        },
        {
          "num": "03",
          "title": "TOK and CAS awareness",
          "body": "Even where a tutor's core focus is a subject, IB tutors here understand how that subject connects to the Theory of Knowledge component, since IB explicitly asks students to make those connections."
        }
      ],
      "subjects": [
        {
          "name": "Math AA (Analysis & Approaches)",
          "code": "SL / HL",
          "blurb": "Proof-based, calculus-heavy pure mathematics at HL and SL."
        },
        {
          "name": "Math AI (Applications & Interpretation)",
          "code": "SL / HL",
          "blurb": "Applied, technology-integrated mathematics for real-world modelling."
        },
        {
          "name": "Physics",
          "code": "SL / HL",
          "blurb": "Core and option topics with a strong internal-assessment lab component."
        },
        {
          "name": "Chemistry",
          "code": "SL / HL",
          "blurb": "Structure, bonding, and quantitative chemistry with IA support."
        },
        {
          "name": "Biology",
          "code": "SL / HL",
          "blurb": "Cell biology through ecology, with a substantial internal assessment investigation."
        },
        {
          "name": "Economics",
          "code": "SL / HL",
          "blurb": "Micro, macro, and global economics through an IB-specific lens on real-world application."
        },
        {
          "name": "Business Management",
          "code": "SL / HL",
          "blurb": "Strategic analysis and case-study evaluation at Diploma level."
        },
        {
          "name": "English A: Language & Literature",
          "code": "SL / HL",
          "blurb": "Textual analysis across literary and non-literary works."
        },
        {
          "name": "Psychology",
          "code": "SL / HL",
          "blurb": "Biological, cognitive, and sociocultural approaches with IA-specific research skills."
        },
        {
          "name": "Computer Science",
          "code": "SL / HL",
          "blurb": "Programming, systems, and a significant IA development project."
        },
        {
          "name": "Theory of Knowledge / Extended Essay support",
          "code": "DP CORE",
          "blurb": "Structured guidance for TOK essays and presentations, and EE research and drafting."
        }
      ],
      "faqs": [
        {
          "q": "Can one tutor help across multiple IB subjects, or just one?",
          "a": "Typically one subject per tutor, matched to your HL/SL level specifically — mention if you need support across several subjects and we'll coordinate matching accordingly."
        },
        {
          "q": "Do you help with the Extended Essay even if it's not tied to a specific subject tutor?",
          "a": "Yes — EE support can be arranged separately, focused on research methodology and structure regardless of subject."
        },
        {
          "q": "How does IA support work alongside regular tutoring?",
          "a": "Your tutor can dedicate specific sessions to IA planning and drafting feedback — mention this need directly in your inquiry."
        },
        {
          "q": "Is this suitable for a student partway through DP1 who's fallen behind?",
          "a": "Yes — mention your current stage and specific gaps in your inquiry so we match a tutor who can pick up mid-programme effectively."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": [
        {
          "q": "Is my tutor matched to HL or SL specifically?",
          "a": "Yes — the content depth differs enough between them that we match your tutor to the exact level you're taking, not just the subject name."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    },
    "sabis": {
      "hero": {
        "eyebrow": "SABIS TUTORING",
        "h1": "Tutoring Matched to the SABIS Educational System",
        "sub": "Support built around SABIS's structured, cumulative approach to core subjects."
      },
      "headings": {
        "why": "Why SABIS tutoring is different here",
        "subjects": "Subjects we cover for SABIS"
      },
      "trust": [
        "Matched to your AMS cycle",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-imran",
          "name": "Imran A.",
          "qual": "M.Sc. Mathematics",
          "years": "9 years teaching",
          "subjects": [
            "Mathematics"
          ],
          "boards": "SABIS Grades 5–12"
        },
        {
          "photoId": "tutor-photo-sabis-mark",
          "name": "Mark L.",
          "qual": "B.A. English, CELTA",
          "years": "7 years teaching",
          "subjects": [
            "English"
          ],
          "boards": "SABIS Grades 5–12"
        },
        {
          "photoId": "tutor-photo-sabis-rania",
          "name": "Rania F.",
          "qual": "B.Sc. Biology, PGCE",
          "years": "6 years teaching",
          "subjects": [
            "Science"
          ],
          "boards": "SABIS Grades 5–10"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "Aligned to the AMS structure",
          "body": "SABIS's Academic Monitoring System assesses frequently and cumulatively — your tutor works with that same rhythm, reinforcing material before the next assessment cycle rather than after gaps appear."
        },
        {
          "num": "02",
          "title": "Consistency across the sequence",
          "body": "Because SABIS content is tightly sequenced, we prioritise keeping the same tutor with a student across terms, so progress isn't lost to re-familiarisation each time."
        }
      ],
      "subjects": [
        {
          "name": "Mathematics",
          "code": "CORE",
          "blurb": "Core numeracy and problem-solving aligned to the SABIS sequence."
        },
        {
          "name": "English",
          "code": "CORE",
          "blurb": "Language and literacy skills built cumulatively across AMS cycles."
        },
        {
          "name": "Science",
          "code": "CORE",
          "blurb": "Foundational science content matched to SABIS's integrated approach."
        },
        {
          "name": "Social Studies",
          "code": "CORE",
          "blurb": "Core social studies content within the SABIS structure."
        },
        {
          "name": "French",
          "code": "LANGUAGE",
          "blurb": "Language skills development within the SABIS curriculum."
        }
      ],
      "faqs": [
        {
          "q": "What is AMS and how does tutoring fit around it?",
          "a": "AMS is SABIS's frequent internal testing cycle — your tutor works to reinforce whatever material is currently being assessed."
        },
        {
          "q": "Is SABIS tutoring different from general subject tutoring?",
          "a": "Yes — because SABIS content is cumulative and tightly sequenced, addressing gaps early matters more here than in curricula with more flexible pacing."
        },
        {
          "q": "Which subjects are available for SABIS tutoring right now?",
          "a": "Our SABIS subject coverage is still expanding — tell us the subjects you need in your inquiry and we'll confirm availability directly before you commit to anything."
        },
        {
          "q": "My child attends a SABIS school but I'm not sure which subjects need support — what should I do?",
          "a": "Submit an inquiry describing the general area of difficulty, and our team can help identify the right focus based on your school's specific AMS reporting."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": [
        {
          "q": "What is AMS and how does tutoring fit around it?",
          "a": "AMS (Academic Monitoring System) is SABIS's frequent internal testing cycle — your tutor works to reinforce the material being assessed in the current cycle specifically."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    },
    "hkdse": {
      "hero": {
        "eyebrow": "HKDSE TUTORING",
        "h1": "HKDSE Tutoring for Hong Kong's University Entrance Exam",
        "sub": "Core and elective subject support built around the NSS structure."
      },
      "headings": {
        "why": "Why HKDSE tutoring is different here",
        "subjects": "Subjects we cover for HKDSE"
      },
      "trust": [
        "Core-subject specialists",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-hkdse-wing",
          "name": "Wing C.",
          "qual": "M.Sc. Mathematics",
          "years": "10 years teaching",
          "subjects": [
            "Mathematics (Compulsory)",
            "M1/M2"
          ],
          "boards": "Core & Extended"
        },
        {
          "photoId": "tutor-photo-hkdse-alan",
          "name": "Alan T.",
          "qual": "M.A. English",
          "years": "8 years teaching",
          "subjects": [
            "English Language"
          ],
          "boards": "Core"
        },
        {
          "photoId": "tutor-photo-hkdse-mei",
          "name": "Mei L.",
          "qual": "M.Sc. Chemistry",
          "years": "7 years teaching",
          "subjects": [
            "Chemistry",
            "Biology"
          ],
          "boards": "Electives"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "Core subject focus available",
          "body": "Since English Language, Mathematics, and other core subjects are compulsory for every HKDSE student, we prioritise strong tutor matching here specifically."
        },
        {
          "num": "02",
          "title": "Familiarity with the grading scale",
          "body": "Your tutor understands the 5**–U grading structure and what separates a 5 from a 5** in exam technique, not just content knowledge."
        }
      ],
      "subjects": [
        {
          "name": "Mathematics (Compulsory)",
          "code": "CORE",
          "blurb": "Core mathematics content required of every HKDSE student."
        },
        {
          "name": "Mathematics Extended (M1/M2)",
          "code": "EXTENDED",
          "blurb": "Additional calculus and statistics modules for students taking an extended paper."
        },
        {
          "name": "English Language",
          "code": "CORE",
          "blurb": "The compulsory core English paper, covering all assessed skills."
        },
        {
          "name": "Biology",
          "code": "ELECTIVE",
          "blurb": "Core biological concepts with HKDSE-specific exam technique."
        },
        {
          "name": "Chemistry",
          "code": "ELECTIVE",
          "blurb": "Structure, reactions, and calculation-based exam preparation."
        },
        {
          "name": "Physics",
          "code": "ELECTIVE",
          "blurb": "Mechanics, electricity, and waves at HKDSE elective depth."
        },
        {
          "name": "Economics",
          "code": "ELECTIVE",
          "blurb": "Microeconomic and macroeconomic principles as an HKDSE elective."
        },
        {
          "name": "BAFS (Business, Accounting & Financial Studies)",
          "code": "ELECTIVE",
          "blurb": "Core business and accounting concepts for the BAFS elective."
        },
        {
          "name": "ICT",
          "code": "ELECTIVE",
          "blurb": "Information and communication technology theory and applied skills."
        }
      ],
      "faqs": [
        {
          "q": "Do you tutor the compulsory core subjects specifically?",
          "a": "Yes — Mathematics and English Language (both compulsory) are core offerings, alongside available electives."
        },
        {
          "q": "What's the difference between M1 and M2 in Extended Mathematics?",
          "a": "M1 focuses on calculus and statistics, M2 on calculus and algebra — your tutor can help confirm which your school has assigned if you're unsure."
        },
        {
          "q": "Can tutoring help move a grade from a 4 to a 5 or higher?",
          "a": "This depends on the individual student's starting point — your tutor can give an honest assessment in early sessions."
        },
        {
          "q": "Do you tutor Chinese Language or Citizenship and Social Development?",
          "a": "Not currently listed — mention your specific need in your inquiry and we'll advise on availability."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": [
        {
          "q": "Do you tutor the compulsory core subjects specifically?",
          "a": "Yes — Mathematics and English Language, both compulsory for every HKDSE student, are core offerings here, alongside available electives."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    },
    "american-curriculum": {
      "hero": {
        "eyebrow": "AMERICAN CURRICULUM TUTORING",
        "h1": "American Curriculum and AP Tutoring for US University Admissions",
        "sub": "GPA-focused subject support plus AP exam preparation from tutors who know what US admissions actually weigh."
      },
      "headings": {
        "why": "Why American Curriculum tutoring is different here",
        "subjects": "Subjects we cover for American Curriculum"
      },
      "trust": [
        "AP-format specialists",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-ryan",
          "name": "Ryan B.",
          "qual": "B.A. Mathematics",
          "years": "6 years teaching",
          "subjects": [
            "AP Calculus AB/BC",
            "Algebra I/II"
          ],
          "boards": "AP & high-school core"
        },
        {
          "photoId": "tutor-photo-priya",
          "name": "Priya N.",
          "qual": "M.A. Economics",
          "years": "7 years teaching",
          "subjects": [
            "AP Macroeconomics",
            "AP Microeconomics"
          ],
          "boards": "AP"
        },
        {
          "photoId": "tutor-photo-sana",
          "name": "Sana T.",
          "qual": "B.Ed. Primary Education",
          "years": "10 years teaching",
          "subjects": [
            "Elementary & Middle School core",
            "Numeracy & Literacy"
          ],
          "boards": "Grades 1–8 core"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "GPA-aware tutoring",
          "body": "Because grades accumulate continuously, your tutor focuses on steady, sustained performance across assignments and tests, not just a single exam moment."
        },
        {
          "num": "02",
          "title": "AP exam specialists",
          "body": "For students taking AP courses, tutors are matched specifically to College Board's AP exam format and scoring rubrics — a different skill from regular coursework support."
        },
        {
          "num": "03",
          "title": "University-admissions context",
          "body": "Tutors understand how course rigor and AP scores factor into competitive US admissions, and can help prioritise where effort matters most."
        }
      ],
      "subjects": [
        {
          "name": "AP Calculus AB/BC",
          "code": "AP",
          "blurb": "Differential and integral calculus, with BC covering additional series and polar content."
        },
        {
          "name": "AP Biology",
          "code": "AP",
          "blurb": "College-level biology depth, including the AP-specific free-response format."
        },
        {
          "name": "AP Chemistry",
          "code": "AP",
          "blurb": "Advanced chemistry with the quantitative rigor AP exams demand."
        },
        {
          "name": "AP Physics 1/2/C",
          "code": "AP",
          "blurb": "Mechanics, electromagnetism, and (for Physics C) calculus-based physics."
        },
        {
          "name": "AP English Language",
          "code": "AP",
          "blurb": "Rhetorical analysis and argumentative writing at AP standard."
        },
        {
          "name": "AP English Literature",
          "code": "AP",
          "blurb": "Literary analysis across prose, poetry, and drama."
        },
        {
          "name": "AP US History",
          "code": "AP",
          "blurb": "Thematic and chronological US history at college-survey depth."
        },
        {
          "name": "AP World History",
          "code": "AP",
          "blurb": "Global historical analysis across the AP's required time periods."
        },
        {
          "name": "AP Economics (Micro/Macro)",
          "code": "AP",
          "blurb": "Both AP economics courses, exam-focused."
        },
        {
          "name": "AP Computer Science A",
          "code": "AP",
          "blurb": "Java-based programming at AP exam standard."
        },
        {
          "name": "Algebra I/II",
          "code": "HS CORE",
          "blurb": "Foundational and intermediate algebra for non-AP coursework support."
        },
        {
          "name": "Geometry",
          "code": "HS CORE",
          "blurb": "Core geometry content for continuous GPA support."
        }
      ],
      "faqs": [
        {
          "q": "Is tutoring different for AP courses versus regular coursework?",
          "a": "Yes — AP tutoring focuses specifically on College Board's exam format and scoring rubrics, while regular coursework tutoring focuses on steady GPA support."
        },
        {
          "q": "When should AP exam prep specifically start?",
          "a": "Ideally a few months before the May exam date, though ongoing course support throughout the year also strengthens exam readiness."
        },
        {
          "q": "Can a tutor help with both coursework and AP exam prep for the same subject?",
          "a": "Yes — mention both needs in your inquiry so sessions can be structured accordingly."
        },
        {
          "q": "My child isn't in an AP course but needs general subject support — is that available?",
          "a": "Yes — Algebra I/II and Geometry are offered as non-AP coursework support, and other subjects can be discussed based on need."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": [
        {
          "q": "Is tutoring different for AP courses versus regular coursework?",
          "a": "Yes — AP tutoring focuses specifically on College Board's exam format and scoring rubrics, while regular coursework tutoring focuses on steady GPA support across the year."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    },
    "canadian-curriculum": {
      "hero": {
        "eyebrow": "CANADIAN CURRICULUM TUTORING",
        "h1": "Canadian Curriculum Tutoring for OSSD and Provincial Standards",
        "sub": "Course-specific support across Applied, Academic, and University Preparation streams."
      },
      "headings": {
        "why": "Why Canadian Curriculum tutoring is different here",
        "subjects": "Subjects we cover for Canadian Curriculum"
      },
      "trust": [
        "Stream-matched tutors",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-ca-grace",
          "name": "Grace P.",
          "qual": "M.Sc. Mathematics, OCT",
          "years": "10 years teaching",
          "subjects": [
            "Advanced Functions (MHF4U)",
            "Calculus & Vectors (MCV4U)"
          ],
          "boards": "Academic & University Prep"
        },
        {
          "photoId": "tutor-photo-ca-noah",
          "name": "Noah S.",
          "qual": "B.Ed. English, OCT",
          "years": "8 years teaching",
          "subjects": [
            "English (ENG4U)"
          ],
          "boards": "Applied & Academic"
        },
        {
          "photoId": "tutor-photo-hira",
          "name": "Hira M.",
          "qual": "M.Phil. Chemistry",
          "years": "9 years teaching",
          "subjects": [
            "Chemistry (SCH4U)",
            "Biology (SBI4U)"
          ],
          "boards": "University Prep"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "Stream-aware matching",
          "body": "Your tutor is matched to the specific stream — Applied, Academic, or University Prep — since course expectations differ meaningfully between them."
        },
        {
          "num": "02",
          "title": "Coursework-weighted support",
          "body": "Canadian assessment leans heavily on ongoing coursework (roughly 70% of the final grade), so tutoring here focuses on sustained performance across assignments, not just a single final summative."
        }
      ],
      "subjects": [
        {
          "name": "Mathematics (Functions/Advanced Functions/Calculus & Vectors)",
          "code": "MHF4U / MCV4U",
          "blurb": "The University Prep math sequence through to Grade 12."
        },
        {
          "name": "English",
          "code": "ENG4U",
          "blurb": "Reading, writing, and media literacy across the required English course sequence."
        },
        {
          "name": "Biology",
          "code": "SBI4U",
          "blurb": "Core biology content aligned to Ontario curriculum expectations."
        },
        {
          "name": "Chemistry",
          "code": "SCH4U",
          "blurb": "Structure, reactions, and quantitative chemistry."
        },
        {
          "name": "Physics",
          "code": "SPH4U",
          "blurb": "Mechanics, energy, and waves at Grade 11/12 depth."
        },
        {
          "name": "Canadian & World History",
          "code": "CHC2D",
          "blurb": "Required history courses within the Canadian curriculum."
        },
        {
          "name": "Civics & Careers",
          "code": "CHV2O / GLC2O",
          "blurb": "The compulsory Grade 10 civics and career-planning course."
        },
        {
          "name": "French",
          "code": "FSF",
          "blurb": "Core and extended French language courses."
        },
        {
          "name": "Business Studies",
          "code": "BBB4M",
          "blurb": "Introductory and advanced business courses within the stream structure."
        },
        {
          "name": "Computer Science",
          "code": "ICS4U",
          "blurb": "Programming and computational thinking courses at the Canadian curriculum level."
        }
      ],
      "faqs": [
        {
          "q": "Does my child's academic stream affect tutoring?",
          "a": "Yes — Applied, Academic, and University Preparation streams have different pacing and depth, and your tutor is matched accordingly."
        },
        {
          "q": "Since coursework matters more than exams here, how does tutoring adapt?",
          "a": "Sessions focus on ongoing assignment quality and understanding throughout the course, rather than saving intensity for a single final exam."
        },
        {
          "q": "Can tutoring help with the required Grade 10 literacy test?",
          "a": "Yes — mention this specifically in your inquiry and we'll match a tutor experienced with that requirement."
        },
        {
          "q": "My child is switching from Applied to Academic stream mid-year — can tutoring help with that transition?",
          "a": "Yes — mention this directly in your inquiry so we can match a tutor experienced with bridging that gap."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": []
    },
    "ielts": {
      "hero": {
        "eyebrow": "IELTS PREPARATION",
        "h1": "IELTS Preparation for the Band Score You Actually Need",
        "sub": "Focused practice across Listening, Reading, Writing, and Speaking — Academic or General Training."
      },
      "headings": {
        "why": "Why IELTS preparation is different here",
        "subjects": "Skills we cover for IELTS"
      },
      "trust": [
        "Band-score-targeted prep",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-ielts-emma",
          "name": "Emma J.",
          "qual": "M.A. Applied Linguistics, CELTA",
          "years": "11 years teaching",
          "subjects": [
            "Writing",
            "Speaking"
          ],
          "boards": "Academic & General Training"
        },
        {
          "photoId": "tutor-photo-ayesha",
          "name": "Ayesha F.",
          "qual": "M.A. TESOL",
          "years": "11 years teaching",
          "subjects": [
            "Speaking",
            "Band 7+ strategy"
          ],
          "boards": "Academic & General Training"
        },
        {
          "photoId": "tutor-photo-nadia",
          "name": "Nadia R.",
          "qual": "M.A. English Literature",
          "years": "10 years teaching",
          "subjects": [
            "Reading",
            "Listening"
          ],
          "boards": "Academic & General Training"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "Band-score-targeted preparation",
          "body": "Sessions are built around your specific target band score, focusing effort on whichever of the four skills needs the most improvement rather than treating all four equally."
        },
        {
          "num": "02",
          "title": "Academic and General Training both covered",
          "body": "Your tutor is matched to the version you're actually sitting, since Reading and Writing content differs meaningfully between them."
        },
        {
          "num": "03",
          "title": "Realistic timed practice",
          "body": "IELTS is as much about time management as language ability — sessions include practice under genuine exam time constraints, not just untimed skill-building."
        }
      ],
      "subjects": [
        {
          "name": "Listening",
          "code": "30 MIN",
          "blurb": "Note-taking technique and question-type-specific strategy across all four sections."
        },
        {
          "name": "Reading",
          "code": "60 MIN",
          "blurb": "Skimming, scanning, and time management across passage types."
        },
        {
          "name": "Writing",
          "code": "60 MIN",
          "blurb": "Task 1 (report/letter) and Task 2 (essay) structure, matched to Academic or General Training format."
        },
        {
          "name": "Speaking",
          "code": "11–14 MIN",
          "blurb": "Fluency, coherence, and confidence-building for the face-to-face interview format."
        },
        {
          "name": "Academic vs. General Training strategy",
          "code": "ACADEMIC / GT",
          "blurb": "Making sure preparation is targeted to the correct test version from the outset."
        }
      ],
      "faqs": [
        {
          "q": "How long does IELTS preparation usually take?",
          "a": "This depends heavily on current English level and target band — your tutor can give a realistic timeline after an initial assessment."
        },
        {
          "q": "Should I prepare for Academic or General Training?",
          "a": "This depends on your purpose — university admission requires Academic, most immigration pathways require General Training. Mention your goal in your inquiry if you're unsure which applies."
        },
        {
          "q": "Can tutoring focus on just one skill, like Speaking?",
          "a": "Yes — if one skill is your clear weak point, sessions can be weighted toward it specifically."
        },
        {
          "q": "I already have a test date booked — can sessions be scheduled around it?",
          "a": "Yes — mention your test date in your inquiry and sessions will be paced toward it."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": [
        {
          "q": "How long does IELTS preparation usually take?",
          "a": "This depends heavily on current English level and target band — your tutor can give a realistic timeline after an initial assessment. If you have a test date already booked, mention it in your inquiry so sessions can be paced accordingly."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    },
    "sat": {
      "hero": {
        "eyebrow": "SAT PREPARATION",
        "h1": "SAT Preparation for the Digital Format",
        "sub": "Focused Math and Reading &amp; Writing preparation for the adaptive, computer-based SAT."
      },
      "headings": {
        "why": "Why SAT preparation is different here",
        "subjects": "Sections we cover for SAT"
      },
      "trust": [
        "Digital SAT specialists",
        "Every session recorded",
        "Free trial, no card required",
        "Matched within 24 hours"
      ],
      "steps": [
        {
          "num": "01",
          "title": "You tell us the syllabus.",
          "body": "Which board, which subjects, which year. Two minutes."
        },
        {
          "num": "02",
          "title": "We match, you don't browse.",
          "body": "Our team picks a tutor for your exact board and subject combination. No profile-scrolling, no guessing."
        },
        {
          "num": "03",
          "title": "Free trial session, then decide.",
          "body": "A 30-minute session before any payment. No card required."
        }
      ],
      "tutors": [
        {
          "photoId": "tutor-photo-yusuf",
          "name": "Yusuf M.",
          "qual": "M.Sc. Applied Mathematics",
          "years": "8 years teaching",
          "subjects": [
            "Math"
          ],
          "boards": "Digital SAT"
        },
        {
          "photoId": "tutor-photo-nadia",
          "name": "Nadia R.",
          "qual": "M.A. English Literature",
          "years": "10 years teaching",
          "subjects": [
            "Reading & Writing"
          ],
          "boards": "Digital SAT"
        },
        {
          "photoId": "tutor-photo-ryan",
          "name": "Ryan B.",
          "qual": "B.A. Mathematics",
          "years": "6 years teaching",
          "subjects": [
            "Math",
            "Test strategy"
          ],
          "boards": "Digital SAT"
        }
      ],
      "pillars": [
        {
          "num": "01",
          "title": "Digital SAT format specifically",
          "body": "Preparation is built for the current computer-adaptive test, not the retired paper format — the adaptive scoring model changes strategy in ways older prep materials don't account for."
        },
        {
          "num": "02",
          "title": "Score-targeted preparation",
          "body": "Sessions focus on your target score range and university admissions context, prioritising the sections and question types with the most room for improvement."
        }
      ],
      "subjects": [
        {
          "name": "Math",
          "code": "MAX 800",
          "blurb": "Algebra, advanced math, problem-solving, and data analysis, with strategy specific to the adaptive format."
        },
        {
          "name": "Reading & Writing",
          "code": "MAX 800",
          "blurb": "Shorter, more numerous passages than the old SAT format, requiring a different pacing strategy."
        }
      ],
      "faqs": [
        {
          "q": "Is this the old paper SAT or the new Digital SAT?",
          "a": "Digital SAT specifically — preparation is built around the current adaptive, computer-based format."
        },
        {
          "q": "How is the Digital SAT different from the old version?",
          "a": "It's shorter, computer-adaptive (module difficulty adjusts based on your performance), and calculator use is allowed throughout the Math section."
        },
        {
          "q": "When should SAT prep start relative to test date?",
          "a": "A few months of focused preparation is typical, though this varies by starting level — your tutor can advise after an initial assessment."
        },
        {
          "q": "My child is preparing for both SAT and AP exams — can tutoring cover both?",
          "a": "Yes — mention both needs in your inquiry, since scheduling and focus areas differ between SAT and AP-specific preparation."
        },
        {
          "q": "What happens after I submit an inquiry?",
          "a": "Our team reviews your inquiry and reaches out to confirm details and match you with a tutor."
        },
        {
          "q": "Is the trial session really free?",
          "a": "Yes — no card required, no obligation."
        }
      ],
      "quick": [
        {
          "q": "Is this the old paper SAT or the new Digital SAT?",
          "a": "Digital SAT specifically — preparation is built around the current adaptive, computer-based format. If your prep materials or other sources reference the paper test, that information is now outdated."
        },
        {
          "q": "How much does this cost?",
          "a": "Pricing is prepaid by the hour, in USD. Every plan starts with a free trial session, no payment required.",
          "link": true
        },
        {
          "q": "How soon can we start?",
          "a": "We reply to every inquiry within 24 hours to confirm details and arrange your free trial session."
        }
      ]
    }
  };
