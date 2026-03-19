import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
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
