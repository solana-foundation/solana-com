import { createPreset } from "fumadocs-ui/tailwind-plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  presets: [createPreset()],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-chrome/src/**/*.{js,ts,jsx,tsx}",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
