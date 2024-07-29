module.exports = {
  plugins: [
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
      "@fullhuman/postcss-purgecss",
      {
        content: [
          "./src/pages/**/*.{js,jsx,ts,tsx}",
          "./src/components/**/*.{js,jsx,ts,tsx}",
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
