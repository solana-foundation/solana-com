import { describe, expect, it } from "vitest";
import { contentLanguageAttributes } from "@/lib/docs/content-language";

describe("contentLanguageAttributes", () => {
  it("marks an English page at a right-to-left locale English, left to right", () => {
    expect(contentLanguageAttributes("ar", "en")).toEqual({
      lang: "en",
      dir: "ltr",
    });
  });

  it("marks an English page at a left-to-right locale English too", () => {
    expect(contentLanguageAttributes("ja", "en")).toEqual({
      lang: "en",
      dir: "ltr",
    });
  });

  it("adds nothing when the page is in its locale", () => {
    expect(contentLanguageAttributes("ar", "ar")).toEqual({});
    expect(contentLanguageAttributes("en", "en")).toEqual({});
  });
});
