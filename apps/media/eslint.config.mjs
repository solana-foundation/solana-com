import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import * as mdx from "eslint-plugin-mdx";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends("next/core-web-vitals", "prettier"),
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
    files: ["**/*.{js,jsx,ts,tsx,mdx}"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "react/no-unescaped-entities": "off",
      "react/jsx-no-undef": "off",
    },
  },
  {
    files: ["content/**/*.mdx"],
    rules: {
      "prettier/prettier": "error",
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
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "tina/__generated__/**",
      "public/**",
    ],
  },
];

export default config;

