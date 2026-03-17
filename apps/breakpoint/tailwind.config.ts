import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "23.5rem" /* 376px */,
      "card-sm": "37.5rem" /* 600px */,
      "nav-sm": "55.5rem" /* 888px */,
      md: "48.063rem" /* 769px */,
      "md-lg": "64rem" /* 1024px */,
      lg: "90.063rem" /* 1441px */,
    },
    extend: {
      colors: {
        "primary-null": "#11081b",
        "primary-byte": "#ab66fd",
        "primary-wisp": "#e7d2f9",
        "secondary-lime": "#c9ff7c",
        "secondary-mint": "#14f195",
        "secondary-azure": "#59b8fe",
        byte: "#ab66fd",
        azure: "#59b8fe",
        mint: "#14f195",
        null: "#11081b",
        lime: "#c9ff7c",
        wisp: "#e7d2f9",
        "wisp-10": "rgba(231, 210, 249, 0.1)",
        "wisp-40": "rgba(231, 210, 249, 0.4)",
        "transparent-wisp-80": "#e7d2f9cc",
        "transparent-wisp-60": "#e7d2f999",
        "transparent-wisp-40": "#e7d2f966",
        "transparent-wisp-30": "#e7d2f94d",
        "transparent-wisp-20": "#e7d2f933",
        "transparent-wisp-10": "#e7d2f91a",
        "transparent-null-80": "#11081bcc",
        "transparent-null-60": "#11081b99",
        "transparent-null-40": "#11081b66",
        "transparent-null-20": "#11081b33",
        "transparent-null-10": "#11081b1a",
        "background-primary": "#11081b",
        "background-secondary": "rgba(231, 210, 249, 0.1)",
        "background-invert": "#e7d2f9",
        primary: "#e7d2f9",
        secondary: "rgba(231, 210, 249, 0.6)",
        invert: "#11081b",
        "stroke-primary": "rgba(231, 210, 249, 0.1)",
        "stroke-secondary": "rgba(231, 210, 249, 0.4)",
        "stroke-tertiary": "#e7d2f9",
        "button-fill": "#ab66fd",
        "button-fill-hover": "#e7d2f9",
        "button-fill-disabled": "rgba(231, 210, 249, 0.1)",
      },
      fontFamily: {
        "abc-diatype": ["var(--font-abc-diatype)", "Arial", "sans-serif"],
        "fh-lecturis": ["var(--font-fh-lecturis)", "Arial", "sans-serif"],
        "macan-mono": ["var(--font-macan-mono)", "monospace"],
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
        h1: [
          "clamp(4rem, 3.648rem + 1.502vw, 5rem)",
          {
            lineHeight: "clamp(4.75rem, 4.592rem + 0.676vw, 5.2rem)",
            letterSpacing: "clamp(-0.12rem, -0.145rem + 0.105vw, -0.05rem)",
            fontWeight: "500",
          },
        ],
        h2: [
          "clamp(2.5rem, 2.148rem + 1.502vw, 3.5rem)",
          {
            lineHeight: "clamp(2.6rem, 2.234rem + 1.562vw, 3.64rem)",
            letterSpacing: "-0.05rem",
            fontWeight: "500",
          },
        ],
        h3: [
          "clamp(2.25rem, 2.162rem + 0.376vw, 2.5rem)",
          {
            lineHeight: "clamp(2.655rem, 2.551rem + 0.443vw, 2.95rem)",
            letterSpacing: "clamp(-0.025rem, -0.026rem + 0.004vw, -0.022rem)",
            fontWeight: "500",
          },
        ],
        h4: [
          "1.75rem",
          {
            lineHeight: "2.065rem",
            letterSpacing: "-0.0175rem",
            fontWeight: "500",
          },
        ],
        h5: [
          "1.25rem",
          {
            lineHeight: "1.475rem",
            letterSpacing: "0",
            fontWeight: "400",
          },
        ],
        xl: [
          "clamp(4rem, 2.768rem + 5.258vw, 7.5rem)",
          {
            lineHeight: "clamp(4.75rem, 3.782rem + 4.131vw, 7.5rem)",
            letterSpacing: "clamp(-0.225rem, -0.276rem + 0.218vw, -0.08rem)",
            fontWeight: "400",
          },
        ],
        "stat-display": [
          "clamp(4rem, 3.648rem + 1.502vw, 5rem)",
          {
            lineHeight: "clamp(4.16rem, 3.794rem + 1.562vw, 5.2rem)",
            letterSpacing: "clamp(-0.25rem, -0.282rem + 0.135vw, -0.16rem)",
            fontWeight: "400",
          },
        ],
        p1: [
          "1rem",
          {
            lineHeight: "1.32rem",
            letterSpacing: "0.0045rem",
            fontWeight: "500",
          },
        ],
        p2: [
          "0.875rem",
          {
            lineHeight: "1.25125rem",
            letterSpacing: "0.0075rem",
            fontWeight: "400",
          },
        ],
        "p2-mono": [
          "0.9375rem",
          {
            lineHeight: "1.125rem",
            letterSpacing: "0.075rem",
            fontWeight: "500",
          },
        ],
        "inline-link": [
          "1.125rem",
          {
            lineHeight: "1.53rem",
            letterSpacing: "-0.00438rem",
            fontWeight: "400",
          },
        ],
        eyebrow: [
          "0.882rem",
          {
            lineHeight: "0.09375rem",
            letterSpacing: "0.09375rem",
            fontWeight: "500",
          },
        ],
        button: [
          "0.9375rem",
          {
            lineHeight: "0.9375rem",
            letterSpacing: "0.09375rem",
            fontWeight: "500",
          },
        ],
        caption: [
          "0.6875rem",
          {
            lineHeight: "0.9375rem",
            letterSpacing: "0.06875rem",
            fontWeight: "600",
          },
        ],
      },
      maxWidth: {
        container: "90rem",
      },
      spacing: {
        "4xs": "0.25rem" /* 4px */,
        "3xs": "0.5rem" /* 8px */,
        "2xs": "0.75rem" /* 12px */,
        "2xs-a": "0.875rem" /* 14px */,
        xs: "1rem" /* 16px */,
        s: "1.5rem" /* 24px */,
        m: "2rem" /* 32px */,
        l: "3rem" /* 48px */,
        xl: "4rem" /* 64px */,
        "2xl": "5rem" /* 80px */,
        "3xl": "7.5rem" /* 120px */,
        "4xl": "10rem" /* 160px */,
      },
      letterSpacing: {
        eyebrow: "0.10625rem",
        button: "0.09375rem",
        caption: "0.06875rem",
      },
      borderRadius: {
        bp: "1.5rem",
        "bp-lg": "2rem",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
      backgroundImage: {
        "bp-grid":
          "linear-gradient(rgba(231,210,249,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(231,210,249,0.06) 1px, transparent 1px)",
      },
      animation: {
        ticker: "ticker 2000ms linear infinite",
        "ticker-reverse": "ticker 2000ms linear infinite reverse",
        "accordion-slide-down": "accordion-slide-down 200ms linear",
        "accordion-slide-up": "accordion-slide-up 200ms linear",
        "dialog-overlay-show": "dialog-overlay-show 200ms linear",
        "dialog-overlay-hide": "dialog-overlay-hide 200ms linear",
        "dialog-content-show": "dialog-content-show 200ms linear",
        "dialog-content-hide": "dialog-content-hide 200ms linear forwards",
        "slide-up": "slide-up 300ms ease-out",
        "slide-down": "slide-down 300ms ease-out",
        "slide-in-right": "slide-in-right 300ms ease-out",
        "slide-in-left": "slide-in-left 300ms ease-out",
        "slide-out-right": "slide-out-right 300ms ease-out",
        "slide-out-left": "slide-out-left 300ms ease-out",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-slide-down": {
          "0%": { height: "0" },
          "100%": { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-slide-up": {
          "0%": { height: "var(--radix-accordion-content-height)" },
          "100%": { height: "0" },
        },
        "dialog-overlay-show": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "dialog-overlay-hide": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "dialog-content-show": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "dialog-content-hide": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-down": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(100%)", opacity: "0" },
        },
        "slide-out-left": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(-100%)", opacity: "0" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.18", transform: "scale(1)" },
          "50%": { opacity: "0.28", transform: "scale(1.04)" },
        },
        glowDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(3%, -2%) scale(1.02)" },
          "66%": { transform: "translate(-2%, 1%) scale(0.98)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
