import { createNextConfig } from "@workspace/config-oxlint/next";

export default createNextConfig({
  ignorePatterns: ["scripts/fix-mdx-braces.js", "scripts/fix-mdx-syntax.js"],
});
