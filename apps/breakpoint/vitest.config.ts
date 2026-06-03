import path from "path";
import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: [
      {
        find: "next/navigation",
        replacement: require.resolve("next/navigation"),
      },
      {
        find: "next/server",
        replacement: require.resolve("next/server"),
      },
    ],
  },
  ssr: {
    noExternal: ["next-intl"],
  },
  test: {
    environment: "jsdom",
    include: ["src/tests/**/*.test.tsx", "src/tests/**/*.test.ts"],
    setupFiles: ["./src/tests/setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@@": path.resolve(__dirname, "./"),
    },
  },
});
