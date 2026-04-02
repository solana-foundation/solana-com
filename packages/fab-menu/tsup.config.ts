import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    target: "es2020",
    outDir: "dist",
    jsx: "automatic",
    external: ["react", "react-dom"],
  },
]);
