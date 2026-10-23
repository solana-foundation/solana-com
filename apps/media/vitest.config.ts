import { defineConfig } from "vitest/config";
import { createRequire } from "node:module";
import path from "path";

const require = createRequire(import.meta.url);
const keystaticCoreBrowserEntry = path.join(
  path.dirname(require.resolve("@keystatic/core/package.json")),
  "dist/keystatic-core.js",
);

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
    alias: [
      {
        find: /^@keystatic\/core$/,
        replacement: keystaticCoreBrowserEntry,
      },
      { find: "@/", replacement: path.resolve(__dirname, "./") + "/" },
      { find: "@@/", replacement: path.resolve(__dirname, "./") + "/" },
    ],
  },
});
