import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
    alias: {
      "@/": path.resolve(__dirname, "./") + "/",
      "@@/": path.resolve(__dirname, "./") + "/",
    },
  },
});
