import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Najaح brand palette — DO NOT FREESTYLE
        navy: {
          DEFAULT: "#0F1B33",
          soft: "#1a2748",
          faint: "#2a3958",
        },
        gold: {
          DEFAULT: "#D4A72C",
          soft: "#e3b73d",
          faint: "#FDF6E3",
        },
        "pale-blue": {
          DEFAULT: "#E8EDF5",
          deep: "#D4DCE8",
        },
        cream: "#FAF9F6",
        ink: {
          DEFAULT: "#0F1B33",
          soft: "#5A6478",
          faint: "#8A92A4",
        },
      },
      fontFamily: {
        // Latin: Poppins. Arabic: Tajawal. Loaded via next/font in layout.
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        arabic: ["var(--font-tajawal)", "var(--font-poppins)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Sticking to a tight scale — keeps the design disciplined
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "18px" }],
        base: ["15px", { lineHeight: "24px" }],
        lg: ["17px", { lineHeight: "26px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["32px", { lineHeight: "40px" }],
        "4xl": ["40px", { lineHeight: "48px" }],
        "5xl": ["56px", { lineHeight: "60px" }],
      },
      spacing: {
        // 8-point grid
        "18": "72px",
        "22": "88px",
        "26": "104px",
        "30": "120px",
      },
      borderRadius: {
        btn: "8px",
        input: "8px",
        card: "12px",
        modal: "16px",
        kid: "24px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(15, 27, 51, 0.04)",
        card: "0 4px 12px rgba(15, 27, 51, 0.06)",
        "card-hover": "0 8px 24px rgba(15, 27, 51, 0.10)",
        modal: "0 24px 48px rgba(15, 27, 51, 0.16)",
      },
      maxWidth: {
        container: "1200px",
        prose: "640px",
        auth: "460px",
      },
      backdropBlur: {
        nav: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
