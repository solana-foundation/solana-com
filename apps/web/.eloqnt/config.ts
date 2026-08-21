import { defineConfig } from "@eloqnt/cli";

export default defineConfig({
  srcPath: ["./src", "../../packages/ui-chrome/src"],
  messages: {
    path: "../../packages/i18n/messages/web/{locale}/common",
    locales: "infer",
    sourceLocale: "en",
    format: "json",
  },
  lint: {
    rules: {
      // Many keys are read dynamically (e.g. `t.raw()` arrays, template
      // literal keys) or via the `@workspace/i18n` wrapper imports, which
      // static analysis can't track.
      "orphan-message": "off",
    },
    overrides: [
      {
        // Empty array read via `t.raw()`
        keys: "privacyhack.sponsorBanner.logos",
        rules: { "undefined-key": "off" },
      },
    ],
  },
});
