import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
    alias: {
      "@/": `${path.resolve(__dirname, "./src")}/`,
    },
  },
});
