import { createPreset } from "fumadocs-ui/tailwind-plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  presets: [createPreset()],
  content: [
    "./node_modules/fumadocs-ui/dist/**/*.js",
    // "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        "ch-background": "hsl(var(--fd-secondary)/.5)", // editor.background
        "ch-border": "hsl(var(--fd-border))", // editorGroup.border
        "ch-selection": "var(--ch-20)", // editor.selectionBackground
        "ch-tab-active-foreground": "var(--ch-4)", // tab.activeForeground
        "ch-tab-inactive-foreground": "var(--ch-15)", // tab.inactiveForeground
        "ch-line-number": "var(--ch-26)", // editorLineNumber.foreground
        "ch-tabs-background": "hsl(var(--fd-muted))", // editorGroupHeader.tabsBackground
        "ch-active-border": "var(--tw-prose-links)", // tab.activeBorderTop
      },
    },
  },
};
