import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui-chrome/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      md: "64.0625rem" /* 1025px — Figma desktop */,
      lg: "90.0625rem" /* 1441px — Figma large desktop */,
      xl: "108.0625rem" /* 1729px — Figma oversized */,
    },
    container: {
      /* Page grid per Figma spec (node 2:38):
         - content max-width: 1664px (16 cols × 81.5 + 15 × 24 gutters)
         - mobile: 6 cols, 16px margin/gutter for 320px–1024px
         - desktop: 16 cols, 32px margin, 24px gutter for ≥1025px
         - container caps at 1728px (1664 + 2×32); centers beyond
         Container padding is applied in globals.css to match the same grid. */
      center: true,
      screens: {
        xl: "108rem" /* 1728px — single cap, grows freely below */,
      },
    },
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        purple: "#aa67fb",
        green: "#14f195",
        blue: "#3c91ff",
        yellow: "#c0e021",
        pink: "#e65ddb",
        "core-black": "#000000",
        "core-white": "#ffffff",
        "core-purple": "#aa67fb",
        "core-green": "#14f195",
        "core-blue": "#3c91ff",
        "core-yellow": "#c0e021",
        "core-pink": "#e65ddb",
        "neutral-900": "#000000",
        "neutral-800": "#1e1e1e",
        "neutral-700": "#353535",
        "neutral-600": "#4e4e4e",
        "neutral-500": "#696969",
        "neutral-400": "#858585",
        "neutral-300": "#a2a2a2",
        "neutral-200": "#c0c0c0",
        "neutral-100": "#dfdfdf",
        "neutral-50": "#ffffff",
        "background-primary": "#000000",
        "background-secondary": "#1e1e1e",
        "background-invert": "#ffffff",
        "stroke-primary": "#353535",
        "stroke-secondary": "#4e4e4e",
        "stroke-tertiary": "#ffffff",
        "text-primary": "#ffffff",
        "text-secondary": "#a2a2a2",
        "text-primary-invert": "#000000",
        "text-secondary-invert": "#4e4e4e",
        "text-highlight-primary": "#aa67fb",
        "button-fill": "#ffffff",
        "button-fill-hover": "#aa67fb",
        "button-fill-disabled": "#1e1e1e",
        "transparent-black-80": "#000000cc",
        "transparent-black-60": "#00000099",
        "transparent-black-40": "#00000066",
        "transparent-black-20": "#00000033",
        "transparent-black-05": "#0000000d",
        "transparent-white-05": "#ffffff0d",
        "transparent-white-20": "#ffffff33",
        "transparent-white-40": "#ffffff66",
        "transparent-white-60": "#ffffff99",
        "transparent-white-80": "#ffffffcc",
        "stroke-card": "#353535",
        /* Legacy names kept for older Breakpoint utilities */
        "primary-byte": "#aa67fb",
        byte: "#aa67fb",
        mint: "#14f195",
        "primary-null": "#000000",
        "primary-wisp": "#ffffff",
        "secondary-lime": "#c0e021",
        "secondary-mint": "#14f195",
        "secondary-azure": "#3c91ff",
      },
      fontFamily: {
        sans: ["var(--font-abc-favorit)", "Arial", "sans-serif"],
        mono: ["var(--font-abc-favorit-mono)", "monospace"],
        display: ["var(--font-bp26)", "Arial", "sans-serif"],
        "abc-favorit": ["var(--font-abc-favorit)", "Arial", "sans-serif"],
        "abc-favorit-mono": ["var(--font-abc-favorit-mono)", "monospace"],
        bp26: ["var(--font-bp26)", "Arial", "sans-serif"],
      },
      gridTemplateColumns: {
        "bp-mobile": "repeat(6, minmax(0, 1fr))",
        "bp-desktop": "repeat(16, minmax(0, 1fr))",
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
        display: [
          "var(--text-display)",
          {
            lineHeight: "var(--text-display--line-height)",
            letterSpacing: "var(--text-display--letter-spacing)",
            fontWeight: "400",
          },
        ],
        h1: [
          "var(--text-h1)",
          {
            lineHeight: "var(--text-h1--line-height)",
            letterSpacing: "var(--text-h1--letter-spacing)",
            fontWeight: "400",
          },
        ],
        h2: [
          "var(--text-h2)",
          {
            lineHeight: "var(--text-h2--line-height)",
            letterSpacing: "var(--text-h2--letter-spacing)",
            fontWeight: "400",
          },
        ],
        h3: [
          "var(--text-h3)",
          {
            lineHeight: "var(--text-h3--line-height)",
            letterSpacing: "var(--text-h3--letter-spacing)",
            fontWeight: "400",
          },
        ],
        h4: [
          "var(--text-h4)",
          {
            lineHeight: "var(--text-h4--line-height)",
            letterSpacing: "var(--text-h4--letter-spacing)",
            fontWeight: "400",
          },
        ],
        h5: [
          "var(--text-h5)",
          {
            lineHeight: "var(--text-h5--line-height)",
            letterSpacing: "var(--text-h5--letter-spacing)",
            fontWeight: "400",
          },
        ],
        h6: [
          "var(--text-h6)",
          {
            lineHeight: "var(--text-h6--line-height)",
            letterSpacing: "var(--text-h6--letter-spacing)",
            fontWeight: "400",
          },
        ],
        "p-large": [
          "var(--text-p-large)",
          {
            lineHeight: "var(--text-p-large--line-height)",
            letterSpacing: "var(--text-p-large--letter-spacing)",
            fontWeight: "400",
          },
        ],
        paragraph: [
          "var(--text-paragraph)",
          {
            lineHeight: "var(--text-paragraph--line-height)",
            letterSpacing: "var(--text-paragraph--letter-spacing)",
            fontWeight: "400",
          },
        ],
        eyebrow: [
          "var(--text-eyebrow)",
          {
            lineHeight: "var(--text-eyebrow--line-height)",
            letterSpacing: "var(--text-eyebrow--letter-spacing)",
            fontWeight: "400",
          },
        ],
        button: [
          "var(--text-button)",
          {
            lineHeight: "var(--text-button--line-height)",
            letterSpacing: "var(--text-button--letter-spacing)",
            fontWeight: "700",
          },
        ],
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
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
