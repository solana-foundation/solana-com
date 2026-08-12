/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui-chrome/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ["Diatype", "sans-serif"],
        "brand-mono": ["DSemi", "monospace"],
      },
      colors: {
        // New design system colors (shared with apps/web and apps/docs)
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/typography"),
  ],
};
