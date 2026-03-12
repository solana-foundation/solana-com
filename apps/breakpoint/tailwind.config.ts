import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bp: {
          black: "#050505",
          ink: "#0a0a0a",
          surface: "#111111",
          "surface-2": "#1a1a1a",
          "surface-raised": "#161118",
          text: "#ecd6f9",
          purple: "#623ac4",
          "purple-light": "#7b4fd6",
          "purple-dark": "#442c6e",
          lavender: "#ecd5fa",
          gray: "#7c7c7c",
          "gray-dark": "#3c3c3c",
        },
      },
      fontFamily: {
        "bp-display": [
          "var(--font-breakpoint-display)",
          "system-ui",
          "sans-serif",
        ],
        "bp-body": ["var(--font-breakpoint-body)", "system-ui", "sans-serif"],
        "bp-mono": ["var(--font-breakpoint-mono)", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
