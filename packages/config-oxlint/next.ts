import { defineConfig, type DummyRuleMap } from "oxlint";

import { baseConfig } from "./base.ts";

export function createNextConfig({
  ignorePatterns = [],
  rules = {},
}: {
  ignorePatterns?: string[];
  rules?: DummyRuleMap;
} = {}) {
  return defineConfig({
    ...baseConfig,
    plugins: ["typescript", "react", "nextjs"],
    env: { ...baseConfig.env, browser: true, node: true, serviceworker: true },
    ignorePatterns: [...(baseConfig.ignorePatterns ?? []), ...ignorePatterns],
    rules: {
      ...baseConfig.rules,
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreUsingDeclarations: true,
        },
      ],
      "react/jsx-key": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "react/jsx-no-duplicate-props": "warn",
      "react/jsx-no-target-blank": "warn",
      "react/jsx-no-undef": "warn",
      "react/no-children-prop": "warn",
      "react/no-danger-with-children": "warn",
      "react/no-direct-mutation-state": "warn",
      "react/no-find-dom-node": "warn",
      "react/no-is-mounted": "warn",
      "react/no-render-return-value": "warn",
      "react/no-string-refs": "warn",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "warn",
      "react/rules-of-hooks": "warn",
      "react/exhaustive-deps": "warn",
      "nextjs/google-font-display": "warn",
      "nextjs/google-font-preconnect": "warn",
      "nextjs/inline-script-id": "warn",
      "nextjs/next-script-for-ga": "warn",
      "nextjs/no-assign-module-variable": "warn",
      "nextjs/no-async-client-component": "warn",
      "nextjs/no-before-interactive-script-outside-document": "warn",
      "nextjs/no-css-tags": "warn",
      "nextjs/no-document-import-in-page": "warn",
      "nextjs/no-duplicate-head": "warn",
      "nextjs/no-head-element": "warn",
      "nextjs/no-head-import-in-document": "warn",
      "nextjs/no-html-link-for-pages": "warn",
      "nextjs/no-page-custom-font": "warn",
      "nextjs/no-script-component-in-head": "warn",
      "nextjs/no-styled-jsx-in-document": "warn",
      "nextjs/no-title-in-document-head": "warn",
      "nextjs/no-typos": "warn",
      "nextjs/no-unwanted-polyfillio": "warn",
      ...rules,
    },
  });
}

export const nextConfig = createNextConfig();
