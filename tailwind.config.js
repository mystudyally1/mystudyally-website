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
      // Exact type scale from the design files. Sizes only — the design does
      // not set line-height on headings, so it stays `normal` (see globals.css).
      fontSize: {
        "9": "9px",
        "9_5": "9.5px",
        "10": "10px",
        "10_5": "10.5px",
        "11": "11px",
        "11_5": "11.5px",
        "12": "12px",
        "12_5": "12.5px",
        "13": "13px",
        "13_5": "13.5px",
        "14": "14px",
        "14_5": "14.5px",
        "15": "15px",
        "15_5": "15.5px",
        "16": "16px",
        "17": "17px",
        "18": "18px",
        "19": "19px",
        "20": "20px",
        "21": "21px",
        "22": "22px",
        "23": "23px",
        "24": "24px",
        "25": "25px",
        "26": "26px",
        "27": "27px",
        "30": "30px",
        d22: "clamp(20px,1.72vw,22px)",
        d24: "clamp(20px,1.88vw,24px)",
        d26: "clamp(20px,2.03vw,26px)",
        d28: "clamp(20px,2.19vw,28px)",
        d30: "clamp(20px,2.34vw,30px)",
        d34: "clamp(20px,2.66vw,34px)",
        d36: "clamp(22px,2.81vw,36px)",
        d38: "clamp(23px,2.97vw,38px)",
        d42: "clamp(25px,3.28vw,42px)",
        d44: "clamp(26px,3.44vw,44px)",
        d46: "clamp(28px,3.59vw,46px)",
        d48: "clamp(29px,3.75vw,48px)",
        d52: "clamp(31px,4.06vw,52px)",
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
