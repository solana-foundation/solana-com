import { describe, expect, it } from "vitest";
import {
  deepMergeMessages,
  getEnglishFallbackMessages,
  getMessageFallback,
  loadAppMessages,
  loadMergedMessages,
} from "./messages";
import { IntlErrorCode } from "next-intl";

describe("@workspace/i18n messages", () => {
  it("falls back to English for a missing locale file", async () => {
    const messages = await loadAppMessages("templates", "sv");
    const english = await loadAppMessages("templates", "en");

    expect(messages).toEqual(english);
  });

  it("merges locale strings on top of English for structured catalogs", async () => {
    const messages = await loadAppMessages("accelerate", "es");

    expect(messages).toHaveProperty("accelerate");
    expect(messages).toHaveProperty("accelerate.nav");
  });

  it("inherits shared web messages for docs and app-local overrides", async () => {
    const messages = await loadMergedMessages({ app: "docs", locale: "en" });

    expect(messages).toHaveProperty("nav");
    expect(messages).toHaveProperty("footer");
  });

  it("inherits shared web messages for media", async () => {
    const messages = await loadMergedMessages({ app: "media", locale: "fr" });

    expect(messages).toHaveProperty("nav");
    expect(messages).toHaveProperty("titles");
  });

  it("keeps media nav inherited from web", async () => {
    const webMessages = await loadMergedMessages({ app: "web", locale: "fr" });
    const mediaMessages = await loadMergedMessages({
      app: "media",
      locale: "fr",
    });

    expect(mediaMessages).toHaveProperty("nav");
    expect(mediaMessages.nav).toEqual(webMessages.nav);
  });

  it("does not let primitives overwrite structured English objects", () => {
    const merged = deepMergeMessages(
      { nested: { label: "English" } },
      { nested: "broken" as unknown as { label: string } },
    );

    expect(merged).toEqual({ nested: { label: "English" } });
  });

  it("returns English fallback strings for missing message lookups", async () => {
    const english = await getEnglishFallbackMessages("web");

    expect(
      getMessageFallback(english, {
        namespace: "commands",
        key: "close",
        error: { code: IntlErrorCode.MISSING_MESSAGE },
      }),
    ).toBe("Close");
  });
});
