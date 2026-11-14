import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    // Only the shared components this app renders; scanning the whole
    // package adds the site header and footer's styles to the stylesheet.
    "../../packages/ui-chrome/src/cookie-consent-banner.tsx",
    "../../packages/ui/src/components/button.tsx",
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
