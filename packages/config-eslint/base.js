import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
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
  "**/*.d.ts",
  "**/next-env.d.ts",
];

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const baseConfig = [
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
];

export function withPrettier(config) {
  return [
    ...config.filter((entry) => entry !== eslintConfigPrettier),
    eslintConfigPrettier,
  ];
}

export const config = withPrettier(baseConfig);
