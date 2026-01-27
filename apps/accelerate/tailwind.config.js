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
        // Figma design fonts
        "space-grotesk": [
          "var(--font-space-grotesk)",
          "Space Grotesk",
          "sans-serif",
        ],
        diatype: ["ABC Diatype", "Inter", "sans-serif"],
        brand: ["Diatype", "sans-serif"],
        mono: ["ABCFavoritMono", "monospace"],
      },
      fontSize: {
        // Figma typography tokens
        hero: ["84px", { lineHeight: "1", fontWeight: "300" }],
        h1: ["68px", { lineHeight: "1", fontWeight: "300" }],
        h2: ["32px", { lineHeight: "1.1", fontWeight: "400" }],
        h3: ["24px", { lineHeight: "1.2", fontWeight: "300" }],
        h4: ["20px", { lineHeight: "1.4", fontWeight: "400" }],
        p: ["20px", { lineHeight: "1.4", fontWeight: "300" }],
        "button-big": ["18px", { lineHeight: "1", fontWeight: "600" }],
        button: ["16px", { lineHeight: "1", fontWeight: "600" }],
      },
      colors: {
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
        // Figma design color tokens
        accelerate: {
          purple: "#9945FF", // G1 - Primary brand
          green: "#19FB9B", // G3 - Accent (Figma uses this, not #14F195)
          blue: "#2A88DE", // G2 - Secondary
          cyan: "#00D4FF",
          dark: "#0D0D0D",
          black: "#000000",
          white: "#FFFFFF",
          gray: {
            light: "#D2D2D2", // Light Grey
            dark: "#3D3D3D", // Dark Grey
            100: "#B3B2BC", // Grey 01
            200: "#838191", // Grey 02
            300: "#3B3B40", // Grey 03
            400: "#A3A3A3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
            muted: "#BCBCBC", // Web Color Styles/Black - 5
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        speaker: "48px", // Speaker card image border radius
        "speaker-lg": "58.462px", // Lily Liu special border radius
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "accelerate-gradient":
          "linear-gradient(135deg, #9945FF 0%, #14F195 50%, #00D4FF 100%)",
        "accelerate-cta": "linear-gradient(to right, #9945FF, #19FB9B)",
      },
      spacing: {
        // Figma layout values
        "hero-height": "932px",
        "speaker-card": "380px",
        "speaker-image": "380px",
        "ticket-card": "520px",
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
