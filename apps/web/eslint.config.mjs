import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/.next",
    "**/.source",
    "**/public",
    "**/packages",
    "**/coverage",
  ]),
  {
    extends: compat.config({
      extends: ["next/core-web-vitals", "prettier"],
    }),
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "@next/next/no-img-element": 0,
      "@next/next/no-sync-scripts": 0,
      "jsx-a11y/alt-text": 0,
      strict: 0,

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "react/display-name": 0,
      "react-hooks/exhaustive-deps": 1,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": 0,
      "import/no-anonymous-default-export": 0,
    },
  },
  eslintPluginPrettierRecommended,
]);
