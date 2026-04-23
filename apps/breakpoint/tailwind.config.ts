import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui-chrome/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "23.5rem" /* 376px */,
      "card-sm": "37.5rem" /* 600px */,
      "nav-sm": "55.5rem" /* 888px */,
      md: "48.063rem" /* 769px */,
      "md-lg": "64rem" /* 1024px */,
      lg: "90.063rem" /* 1441px */,
    },
    container: {
      /* Page grid per Figma spec (node 154:6228):
         - content max-width: 1664px (16 cols × 81.5 + 15 × 24 gutters)
         - inner horizontal padding: 20px mobile, 32px ≥md
         - container caps at 1728px (1664 + 2×32); centers beyond */
      center: true,
      padding: {
        DEFAULT: "1.25rem" /* 20px */,
        md: "2rem" /* 32px */,
      },
      screens: {
        sm: "108rem" /* 1728px — single cap, grows freely below */,
      },
    },
    extend: {
      colors: {
        purple: "#aa67fb",
        green: "#14f195",
        blue: "#3c91ff",
        "neutral-900": "#000000",
        "neutral-800": "#1e1e1e",
        "neutral-700": "#353535",
        "neutral-600": "#4e4e4e",
        "neutral-50": "#ffffff",
        "text-secondary": "#a2a2a2",
        "stroke-card": "rgba(255, 255, 255, 0.16)",
        /* Keep old tokens for ui-chrome/FabMenu compatibility */
        "primary-byte": "#ab66fd",
        byte: "#ab66fd",
        mint: "#14f195",
        "primary-null": "#11081b",
        "primary-wisp": "#e7d2f9",
      },
      fontFamily: {
        sans: ["var(--font-abc-favorit)", "Arial", "sans-serif"],
        mono: ["var(--font-abc-favorit-mono)", "monospace"],
        display: ["var(--font-bp26)", "Arial", "sans-serif"],
        "abc-favorit": ["var(--font-abc-favorit)", "Arial", "sans-serif"],
        "abc-favorit-mono": ["var(--font-abc-favorit-mono)", "monospace"],
        bp26: ["var(--font-bp26)", "Arial", "sans-serif"],
      },
      fontSize: {
        "3xs": "0.6875rem" /* 11px */,
        "2xs": "0.875rem" /* 14px */,
        xs: "0.882rem" /* 14.112px */,
        sm: "0.9375rem" /* 15px */,
        base: "1rem" /* 16px */,
        md: "1.0625rem" /* 17px */,
        lg: "1.125rem" /* 18px */,
        "2xl": "1.25rem" /* 20px */,
        "3xl": "1.75rem" /* 28px */,
        "4xl": "2rem" /* 32px */,
        "5xl": "2.25rem" /* 36px */,
        "6xl": "2.5rem" /* 40px */,
        "7xl": "3.5rem" /* 56px */,
        "8xl": "4rem" /* 64px */,
        "9xl": "5rem" /* 80px */,
        "10xl": "7.5rem" /* 120px */,
      },
      spacing: {
        "4xs": "0.25rem" /* 4px */,
        "3xs": "0.5rem" /* 8px */,
        "2xs": "0.75rem" /* 12px */,
        xs: "1rem" /* 16px */,
        s: "1.5rem" /* 24px */,
        m: "2rem" /* 32px */,
        l: "3rem" /* 48px */,
        xl: "4rem" /* 64px */,
        "2xl": "5rem" /* 80px */,
        "3xl": "7.5rem" /* 120px */,
        "4xl": "10rem" /* 160px */,
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        "ticker-reverse": "ticker 30s linear infinite reverse",
        "accordion-slide-down": "accordion-slide-down 200ms linear",
        "accordion-slide-up": "accordion-slide-up 200ms linear",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-slide-down": {
          "0%": { height: "0", opacity: "0" },
          "100%": { height: "var(--accordion-height)", opacity: "1" },
        },
        "accordion-slide-up": {
          "0%": { height: "var(--accordion-height)", opacity: "1" },
          "100%": { height: "0", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
