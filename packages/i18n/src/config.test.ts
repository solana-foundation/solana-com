import { describe, expect, it } from "vitest";

import {
  languageSelectorLanguages,
  languageSelectorLocales,
  languages,
  locales,
} from "./config";

describe("@workspace/i18n config", () => {
  it("keeps Hindi in supported locales while hiding it from the language selector", () => {
    expect(locales).toContain("hi");
    expect(languages).toHaveProperty("hi", "हिन्दी");
    expect(languageSelectorLocales).not.toContain("hi");
    expect(languageSelectorLanguages).not.toHaveProperty("hi");
  });
});
