import path from "path";
import { defineConfig } from "vitest/config";

const INLINE_SVG_MOCK_ID = "\0inline-svg-mock";
const SVG_MOCK_ID = "\0svg-mock";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  plugins: [
    {
      name: "mock-svg-imports",
      enforce: "pre",
      resolveId(source) {
        if (source.endsWith(".inline.svg")) {
          return INLINE_SVG_MOCK_ID;
        }

        if (source.endsWith(".svg")) {
          return SVG_MOCK_ID;
        }
      },
      load(id) {
        if (id === INLINE_SVG_MOCK_ID) {
          return `
            import * as React from "react";

            export default function SvgMock(props) {
              return React.createElement("svg", props);
            }
          `;
        }

        if (id === SVG_MOCK_ID) {
          return 'export default "svg";';
        }
      },
    },
  ],
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
    ],
  },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**"],
    include: ["src/__tests__/**/*.test.{js,jsx,ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
