import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import onlyWarn from "eslint-plugin-only-warn";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

export const repoIgnores = [
  "**/node_modules/**",
  "**/.next/**",
  "**/.source/**",
  "**/.turbo/**",
  "**/coverage/**",
  "**/dist/**",
  "**/build/**",
  "**/public/**",
  "**/next-env.d.ts",
];

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: repoIgnores,
  },
  eslintPluginPrettierRecommended,
];
