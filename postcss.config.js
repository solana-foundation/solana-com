module.exports = {
  plugins: [
    "tailwindcss",
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],
    [
      "./src/utils/postcss-conditional-purge",
      {
        ignore: /globals\.css$/,
        content: [
          "./src/pages/**/*.{js,jsx,ts,tsx}",
          "./src/components/**/*.{js,jsx,ts,tsx}",
          "./src/app/**/*.{ts,tsx}",
          "./node_modules/fumadocs-ui/dist/**/*.js",
        ],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: ["html", "body"],

          greedy: [
            // React-Bootstrap
            /^navbar/,
            /^modal/,
            /^btn-close/,
            /^ratio/,
            /collapse/,
            /^dropdown-/,
            /^flex-/,
            /^accordion-/,
            /^spinner-/,

            // Third-party libraries
            /^slick-/,
            /^react-datetimerange-picker/,
            /^react-calendar/,
            /DocSearch-/,

            // Tailwind
            /tw-/,
          ],
        },
      },
    ],
  ],
};
