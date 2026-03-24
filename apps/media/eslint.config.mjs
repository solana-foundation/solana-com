import { createNextJsConfig } from "@workspace/config-eslint/next-js";
import * as mdx from "eslint-plugin-mdx";

const config = [
  ...createNextJsConfig({
    ignores: ["out/**", "tina/__generated__/**", "**/*.md"],
    rules: {
      "react/jsx-no-undef": "off",
      "react/no-unescaped-entities": "off",
    },
  }),
  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      "no-unused-expressions": "off",
    },
  },
  {
    files: ["content/**/*.mdx"],
    rules: {
      "prettier/prettier": "off",
      "react/no-unescaped-entities": "off",
      "react/jsx-no-undef": "off",
      "no-unused-expressions": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
