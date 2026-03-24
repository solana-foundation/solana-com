import { config as baseConfig } from "@workspace/config-eslint/base";

export default [
  ...baseConfig,
  {
    ignores: ["apps/**", "packages/**"],
  },
];
