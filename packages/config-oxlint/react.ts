import { defineConfig } from "oxlint";

import { baseConfig } from "./base.ts";

export const reactConfig = defineConfig({
  ...baseConfig,
  plugins: ["typescript", "react"],
  env: { ...baseConfig.env, browser: true, serviceworker: true },
  rules: {
    ...baseConfig.rules,
    "react/display-name": "warn",
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
  },
});
