/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{md,mdx}",
  ],
  theme: {
    container: false,
    extend: {
      maxWidth: {
        container: "1280px",
      },
      // Exact pixel steps the design uses that aren't in Tailwind's default
      // scale. Without these the utilities silently emit no CSS.
      spacing: {
        4.5: "1.125rem", // 18px — gaps/padding
        6.5: "1.625rem", // 26px — mobile drawer logo
        9.5: "2.375rem", // 38px — footer social icons
        13: "3.25rem", // 52px — mobile CTA min-height
        50: "12.5rem", // 200px — homepage tutor photo
        55: "13.75rem", // 220px — tutors/curriculum tutor photo
      },
      opacity: {
        97: "0.97",
      },
      fontFamily: {
        sans: [
          "var(--font-nunito)",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      colors: {
        // Primary CTA green (Duolingo-style hard-shadow buttons)
        primary: {
          DEFAULT: "#58CC02",
          hover: "#49AD00",
          shadow: "#58A700",
          light: "#D7FFB8",
          bright: "#61DD02",
        },
        // Links / secondary accent blue
        link: {
          DEFAULT: "#1CB0F6",
          hover: "#1899D6",
          light: "#DDF4FF",
          "light-2": "#B5E5FB",
          "light-3": "#A6DDF4",
        },
        // Text + neutrals
        ink: "#131F24",
        body: "#3C3C3C",
        muted: {
          DEFAULT: "#777777",
          2: "#7A8B93",
          3: "#AFAFAF",
          4: "#B6C2C8",
        },
        border: {
          DEFAULT: "#E5E5E5",
          2: "#EAEAEA",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F7F7",
          alt2: "#EDEFED",
          alt3: "#EFEFEF",
          dark: "#131F24",
        },
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["13px", { lineHeight: "1.6" }],
        md: ["15px", { lineHeight: "1.6" }],
        lg: ["17px", { lineHeight: "1.6" }],
        xl: ["19px", { lineHeight: "1.5" }],
        eyebrow: [
          "11px",
          { lineHeight: "1.4", letterSpacing: "0.12em", fontWeight: "700" },
        ],
        // Fluid display/heading scale (clamp), weight 800, tight tracking
        "d-sm": [
          "clamp(20px,2.2vw,26px)",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        "d-md": [
          "clamp(22px,2.6vw,30px)",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        "d-lg": [
          "clamp(24px,2.9vw,36px)",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        "d-xl": [
          "clamp(25px,3.1vw,40px)",
          { lineHeight: "1.12", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        "d-2xl": [
          "clamp(25px,3.28vw,42px)",
          { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        "d-3xl": [
          "clamp(28px,3.6vw,46px)",
          { lineHeight: "1.08", letterSpacing: "-0.015em", fontWeight: "800" },
        ],
        "d-4xl": [
          "clamp(30px,4vw,52px)",
          { lineHeight: "1.06", letterSpacing: "-0.015em", fontWeight: "800" },
        ],
        "d-5xl": [
          "clamp(32px,4.6vw,58px)",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "d-6xl": [
          "clamp(34px,5.4vw,64px)",
          { lineHeight: "1.03", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "14px",
        lg: "16px",
        xl: "20px",
        "2xl": "22px",
        "3xl": "32px",
        pill: "999px",
      },
      boxShadow: {
        // "hard shadow" pressable button, offset color set per-usage via arbitrary values
        press: "0 4px 0 #58A700",
        "press-white": "0 4px 0 rgba(0,0,0,0.22)",
        card: "0 2px 4px rgba(60,60,60,0.06)",
        panel: "0 8px 24px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
