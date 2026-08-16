// Ported from the design's subject-icons.js — Lucide-style 24px line icons.
// Keys are lowercased substrings of a subject name; first match wins.

const ICONS: Record<string, string[]> = {
  "calculator": [
    "M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
    "M8 6h8v4H8z",
    "M8 14h.01",
    "M12 14h.01",
    "M16 14h.01",
    "M8 18h.01",
    "M12 18h.01",
    "M16 18h.01"
  ],
  "sigma": [
    "M18 7V4H6l6 8-6 8h12v-3"
  ],
  "atom": [
    "M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3",
    "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",
    "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"
  ],
  "flask": [
    "M9 3h6",
    "M10 3v6.5L4.6 19a1.5 1.5 0 0 0 1.3 2.25h12.2A1.5 1.5 0 0 0 19.4 19L14 9.5V3",
    "M7 15h10"
  ],
  "leaf": [
    "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
    "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
  ],
  "speech": [
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  ],
  "bookOpen": [
    "M12 7v14",
    "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
  ],
  "book": [
    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
    "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
  ],
  "trending": [
    "M16 7h6v6",
    "m22 7-8.5 8.5-5-5L2 17"
  ],
  "briefcase": [
    "M16 20V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14",
    "M4 7h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1z"
  ],
  "receipt": [
    "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
    "M8 8h8",
    "M8 13h6"
  ],
  "code": [
    "m16 18 6-6-6-6",
    "m8 6-6 6 6 6"
  ],
  "bulb": [
    "M9 18h6",
    "M10 22h4",
    "M12 2a7 7 0 0 0-4 12.7c.6.6.9 1.4 1 2.3h6c.1-.9.4-1.7 1-2.3A7 7 0 0 0 12 2Z"
  ],
  "headphones": [
    "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    "M18 14h3v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z",
    "M3 14v-2a9 9 0 0 1 18 0v2"
  ],
  "pen": [
    "M12 20h9",
    "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
  ],
  "mic": [
    "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z",
    "M19 10v1a7 7 0 0 1-14 0v-1",
    "M12 18v4"
  ],
  "globe": [
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
    "M3 12h18",
    "M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"
  ],
  "landmark": [
    "M3 21h18",
    "M6 10v8",
    "M12 10v8",
    "M18 10v8",
    "M12 3 3 8h18z"
  ],
  "palette": [
    "M12 21a9 9 0 1 1 0-18c4.97 0 9 3.58 9 8 0 2.5-2 3.5-4 3.5h-2a2 2 0 0 0-1.4 3.4A1.9 1.9 0 0 1 12 21Z",
    "M7.5 11h.01",
    "M10.5 7.5h.01",
    "M15 7.5h.01"
  ],
  "activity": [
    "M22 12h-4l-3 9L9 3l-3 9H2"
  ]
};

const MATCH: [string, string][] = [
  [
    "additional math",
    "sigma"
  ],
  [
    "further math",
    "sigma"
  ],
  [
    "math ai",
    "sigma"
  ],
  [
    "calculus",
    "sigma"
  ],
  [
    "statistic",
    "trending"
  ],
  [
    "math",
    "calculator"
  ],
  [
    "physic",
    "atom"
  ],
  [
    "chem",
    "flask"
  ],
  [
    "bio",
    "leaf"
  ],
  [
    "environmental",
    "leaf"
  ],
  [
    "science",
    "flask"
  ],
  [
    "literature",
    "bookOpen"
  ],
  [
    "reading",
    "bookOpen"
  ],
  [
    "english",
    "speech"
  ],
  [
    "language",
    "speech"
  ],
  [
    "french",
    "speech"
  ],
  [
    "spanish",
    "speech"
  ],
  [
    "listening",
    "headphones"
  ],
  [
    "speaking",
    "mic"
  ],
  [
    "writing",
    "pen"
  ],
  [
    "essay",
    "pen"
  ],
  [
    "knowledge",
    "bulb"
  ],
  [
    "tok",
    "bulb"
  ],
  [
    "psycholog",
    "bulb"
  ],
  [
    "econom",
    "trending"
  ],
  [
    "business",
    "briefcase"
  ],
  [
    "account",
    "receipt"
  ],
  [
    "comput",
    "code"
  ],
  [
    "ict",
    "code"
  ],
  [
    "information tech",
    "code"
  ],
  [
    "histor",
    "landmark"
  ],
  [
    "government",
    "landmark"
  ],
  [
    "politic",
    "landmark"
  ],
  [
    "geograph",
    "globe"
  ],
  [
    "global",
    "globe"
  ],
  [
    "social studies",
    "globe"
  ],
  [
    "art",
    "palette"
  ],
  [
    "design",
    "palette"
  ],
  [
    "physical education",
    "activity"
  ],
  [
    "sport",
    "activity"
  ]
];

export function subjectIconPaths(name: string): string[] {
  const n = String(name ?? "").toLowerCase();
  for (const [needle, icon] of MATCH) {
    if (n.includes(needle)) return ICONS[icon] ?? ICONS.book;
  }
  return ICONS.book;
}
