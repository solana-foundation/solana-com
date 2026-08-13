import path from "node:path";
import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "@@",
        replacement: path.resolve(__dirname, "./"),
      },
      {
        find: "next/image",
        replacement: require.resolve("next/image"),
      },
      {
        find: "next/navigation",
        replacement: require.resolve("next/navigation"),
      },
    ],
  },
  ssr: {
    noExternal: ["fumadocs-ui", "next-intl"],
  },
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.{ts,tsx}"],
  },
});
