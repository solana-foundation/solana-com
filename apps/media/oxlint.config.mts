import { createNextConfig } from "@workspace/config-oxlint/next";

export default createNextConfig({
  ignorePatterns: ["out/**"],
  rules: {
    "react/jsx-no-undef": "off",
    "react/no-unescaped-entities": "off",
  },
});
