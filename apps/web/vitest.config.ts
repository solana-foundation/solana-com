import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
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
        find: /\.svg$/,
        replacement: path.resolve(__dirname, "./src/test/mocks/svgMock.tsx"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**"],
    include: ["src/__tests__/**/*.test.{js,jsx,ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
