import { createPreset } from "fumadocs-ui/tailwind-plugin";
import { preset as solanaPreset } from "@solana/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  presets: [createPreset(), solanaPreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/fumadocs-ui/dist/**/*.js",
    "../../node_modules/radix-ui/**/*.{js,ts,tsx}",
    "../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}",
  ],
  blocklist: ["collapse"], // Block the collapse class from being generated
  theme: {
    extend: {
      // Keep app-specific overrides here if needed
    },
  },
  plugins: [require("tailwindcss-animate")],
};
