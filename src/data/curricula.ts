export type CurriculumGroup = "exam-board" | "test-prep";

export interface Curriculum {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  group: CurriculumGroup;
  subjects: string[];
}

// Mirrors the mega-menu data in SiteHeader.dc.html so the header nav, footer
// links, and /curriculum/[slug] routes all read from one list.
export const CURRICULA: Curriculum[] = [
  {
    slug: "igcse",
    tagline: "Cambridge and Edexcel",
    name: "IGCSE",
    shortName: "IGCSE",
    group: "exam-board",
    subjects: [
      "Mathematics",
      "Additional Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English Language",
      "English Literature",
      "Economics",
      "Business Studies",
      "Accounting",
      "Computer Science",
    ],
  },
  {
    slug: "gcse",
    tagline: "AQA, Edexcel, OCR",
    name: "GCSE",
    shortName: "GCSE",
    group: "exam-board",
    subjects: [
      "Mathematics",
      "English Language",
      "English Literature",
      "Biology",
      "Chemistry",
      "Physics",
      "Combined Science",
      "Geography",
      "History",
      "Business Studies",
      "Economics",
      "Computer Science",
      "French",
    ],
  },
  {
    slug: "a-levels",
    tagline: "Subject specialists",
    name: "A Levels",
    shortName: "A Levels",
    group: "exam-board",
    subjects: [
      "Mathematics",
      "Further Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Business Studies",
      "Accounting",
      "Computer Science",
      "English Literature",
      "Psychology",
      "Sociology",
      "Geography",
      "History",
      "Law",
    ],
  },
  {
    slug: "ib",
    tagline: "HL, SL, and the Core",
    name: "IB",
    shortName: "IB",
    group: "exam-board",
    subjects: [
      "Math AA",
      "Math AI",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Business Management",
      "English A: Language & Literature",
      "Psychology",
      "Computer Science",
      "TOK / EE support",
    ],
  },
  {
    slug: "sabis",
    tagline: "AMS-aligned support",
    name: "SABIS",
    shortName: "SABIS",
    group: "exam-board",
    subjects: ["Mathematics", "English", "Science", "Social Studies", "French"],
  },
  {
    slug: "hkdse",
    tagline: "Core and electives",
    name: "HKDSE",
    shortName: "HKDSE",
    group: "exam-board",
    subjects: [
      "Mathematics (Compulsory)",
      "Mathematics Extended (M1/M2)",
      "English Language",
      "Biology",
      "Chemistry",
      "Physics",
      "Economics",
      "BAFS",
      "ICT",
    ],
  },
  {
    slug: "american-curriculum",
    tagline: "US public and private",
    name: "American Curriculum",
    shortName: "American",
    group: "exam-board",
    subjects: [
      "AP Calculus AB/BC",
      "AP Biology",
      "AP Chemistry",
      "AP Physics 1/2/C",
      "AP English Language",
      "AP English Literature",
      "AP US History",
      "AP World History",
      "AP Economics (Micro/Macro)",
      "AP Computer Science A",
      "Algebra I/II",
      "Geometry",
    ],
  },
  {
    slug: "canadian-curriculum",
    tagline: "Province-aligned",
    name: "Canadian Curriculum",
    shortName: "Canadian",
    group: "exam-board",
    subjects: [
      "Mathematics",
      "English",
      "Biology",
      "Chemistry",
      "Physics",
      "Canadian & World History",
      "Civics & Careers",
      "French",
      "Business Studies",
      "Computer Science",
    ],
  },
  {
    slug: "ielts",
    tagline: "All four modules",
    name: "IELTS",
    shortName: "IELTS",
    group: "test-prep",
    subjects: ["Listening", "Reading", "Writing", "Speaking"],
  },
  {
    slug: "sat",
    tagline: "Math and EBRW",
    name: "SAT",
    shortName: "SAT",
    group: "test-prep",
    subjects: ["Math", "Reading & Writing"],
  },
];

export function getCurriculumBySlug(slug: string): Curriculum | undefined {
  return CURRICULA.find((c) => c.slug === slug);
}

export const EXAM_BOARD_CURRICULA = CURRICULA.filter((c) => c.group === "exam-board");
export const TEST_PREP_CURRICULA = CURRICULA.filter((c) => c.group === "test-prep");
