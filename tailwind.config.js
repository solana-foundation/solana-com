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
};
