import { createPreset } from "fumadocs-ui/tailwind-plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  presets: [createPreset()],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-chrome/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/templates/src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/fumadocs-ui/dist/**/*.js",
    "./node_modules/radix-ui/**/*.{js,ts,tsx}",
  ],
  blocklist: ["collapse"], // Block the collapse class from being generated
  theme: {
    extend: {
      colors: {
        "ch-background": "var(--ch-16)", // editor.background
        "ch-border": "hsl(var(--fd-border))", // editorGroup.border
        "ch-selection": "var(--ch-20)", // editor.selectionBackground
        "ch-tab-active-foreground": "var(--ch-4)", // tab.activeForeground
        "ch-tab-inactive-foreground": "var(--ch-15)", // tab.inactiveForeground
        "ch-line-number": "var(--ch-24)", // editorLineNumber.foreground
        "ch-tabs-background": "hsl(var(--fd-muted))", // editorGroupHeader.tabsBackground
        "ch-active-border": "var(--ch-3)", // tab.activeBorderTop
        "solution-bg": "#080d17",
        // New design system colors
        "nd-bg": "#000000",
        "nd-cta": "#FFFFFF",
        "nd-on-cta-high-em-text": "#000000",
        "nd-on-cta-mid-em-text": "#000000A3",
        "nd-high-em-text": "#FFFFFF",
        "nd-mid-em-text": "#ABABBA",
        "nd-mid-em-text-alpha": "#FFFFFFA3",
        "nd-primary": "#FFFFFF",
        "nd-primary-hovered": "#FFFFFFE5",
        "nd-on-primary": "#000000",
        "nd-inverse": "#000000",
        "nd-on-inverse": "#FFFFFF",
        "nd-border-light": "#ECE4FD1F",
        "nd-border-prominent": "#ECE4FD33",
        "nd-border-hovered": "#ECE4FD52",
        "nd-highlight-lavendar": "#CA9FF5",
        "nd-highlight-blue": "#6693F7",
        "nd-highlight-gold": "#FFC526",
        "nd-highlight-orange": "#F48252",
        "nd-highlight-green": "#55E9AB",
        "nd-highlight-lime": "#CFF15E",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        brand: ["Diatype", "sans-serif"],
        "brand-mono": ["DSemi", "monospace"],
      },
      screens: {
        "2xl": "1440px",
      },
      spacing: {
        "screen-2xl": "1440px",
        "screen-md": "768px",
        "screen-xs": "390px",
        // Default Tailwind spacing to prevent conflicts with Bootstrap spacing
        // Use it till Bootstrap is removed from the project
        "twd-auto": "auto",
        "twd-0": "0rem",
        "twd-px": "1px",
        "twd-0.5": "0.125rem",
        "twd-1": "0.25rem",
        "twd-1.5": "0.375rem",
        "twd-2": "0.5rem",
        "twd-2.5": "0.625rem",
        "twd-3": "0.75rem",
        "twd-3.5": "0.875rem",
        "twd-4": "1rem",
        "twd-5": "1.25rem",
        "twd-6": "1.5rem",
        "twd-7": "1.75rem",
        "twd-8": "2rem",
        "twd-9": "2.25rem",
        "twd-10": "2.5rem",
        "twd-11": "2.75rem",
        "twd-12": "3rem",
        "twd-14": "3.5rem",
        "twd-16": "4rem",
        "twd-20": "5rem",
        "twd-24": "6rem",
        "twd-28": "7rem",
        "twd-32": "8rem",
        "twd-36": "9rem",
        "twd-40": "10rem",
        "twd-44": "11rem",
        "twd-48": "12rem",
        "twd-52": "13rem",
        "twd-56": "14rem",
        "twd-60": "15rem",
        "twd-64": "16rem",
        "twd-72": "18rem",
        "twd-80": "20rem",
        "twd-96": "24rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addVariant }) {
      addVariant("light", ".light &");
    },
  ],
};
