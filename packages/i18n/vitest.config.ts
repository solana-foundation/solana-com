import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

export default defineConfig({
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
});
