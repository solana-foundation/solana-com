import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui-chrome/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "var(--font-bldr-display)",
          "var(--font-bldr-body)",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        // Suisse Int'l is the design's body face. Until the licensed files are
        // added (see AGENTS.md), ABC Diatype stands in via --font-bldr-body.
        body: [
          "var(--font-bldr-body)",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // `surface` and `ink` resolve per section; see globals.css.
        surface: "rgb(var(--bldr-bg) / <alpha-value>)",
        ink: "rgb(var(--bldr-fg) / <alpha-value>)",
        bldr: {
          purple: "#7745FF",
        },
      },
      maxWidth: {
        page: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
