import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "web-component": "src/web-component.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    target: "es2020",
    outDir: "dist",
    jsx: "automatic",
    jsxImportSource: "preact",
    esbuildOptions(options) {
      options.alias = {
        react: "preact/compat",
        "react-dom": "preact/compat",
      };
    },
  },
  {
    entry: {
      "react-wrapper": "src/react-wrapper.tsx",
    },
    format: ["esm"],
    dts: {
      tsconfig: "tsconfig.react.json",
    },
    target: "es2020",
    outDir: "dist",
    external: ["react", "react-dom"],
  },
]);
