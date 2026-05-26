import pluginNext from "@next/eslint-plugin-next";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import { baseConfig, withPrettier } from "./base.js";

const nextJsRules = {
  ...pluginReactHooks.configs.recommended.rules,
  ...pluginNext.configs.recommended.rules,
  ...pluginNext.configs["core-web-vitals"].rules,
  "@next/next/no-img-element": "off",
  "@next/next/no-sync-scripts": "off",
  "import/no-anonymous-default-export": "off",
  "no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreUsingDeclarations: true,
    },
  ],
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreUsingDeclarations: true,
    },
  ],
  "react/display-name": "off",
  "react/prop-types": "off",
  "react/react-in-jsx-scope": "off",
  "react-hooks/exhaustive-deps": "warn",
};

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export function createNextJsConfig({ ignores = [], rules = {} } = {}) {
  return withPrettier([
    ...baseConfig,
    {
      ...pluginReact.configs.flat.recommended,
      languageOptions: {
        ...pluginReact.configs.flat.recommended.languageOptions,
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.serviceworker,
        },
      },
    },
    {
      plugins: {
        "@next/next": pluginNext,
        "react-hooks": pluginReactHooks,
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        ...nextJsRules,
        ...rules,
      },
    },
    ...(ignores.length > 0 ? [{ ignores }] : []),
  ]);
}

export const nextJsConfig = createNextJsConfig();
