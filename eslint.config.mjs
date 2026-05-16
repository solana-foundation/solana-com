import { baseConfig, withPrettier } from "@workspace/config-eslint/base";

export default withPrettier([
  ...baseConfig,
  {
    ignores: ["apps/**", "packages/**"],
  },
]);
