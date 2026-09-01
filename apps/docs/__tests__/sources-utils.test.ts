import { describe, expect, it } from "vitest";
import { toUrlWithoutLocale } from "../src/app/sources/utils";

describe("toUrlWithoutLocale", () => {
  it("strips locale segments from nested docs paths", () => {
    expect(toUrlWithoutLocale("/docs/en/intro", "en")).toBe("/docs/intro");
    expect(toUrlWithoutLocale("/docs/zh/intro", "zh")).toBe("/docs/intro");
    expect(toUrlWithoutLocale("/learn/es/cookbook", "es")).toBe(
      "/learn/cookbook",
    );
  });

  it("strips locale segment from root section paths", () => {
    expect(toUrlWithoutLocale("/docs/zh", "zh")).toBe("/docs");
    expect(toUrlWithoutLocale("/docs/zh/", "zh")).toBe("/docs");
    expect(toUrlWithoutLocale("/learn/es", "es")).toBe("/learn");
    expect(toUrlWithoutLocale("/zh", "zh")).toBe("/");
  });

  it("preserves unlocalized paths", () => {
    expect(toUrlWithoutLocale("/docs/intro", "en")).toBe("/docs/intro");
    expect(toUrlWithoutLocale("/docs", "zh")).toBe("/docs");
    expect(toUrlWithoutLocale("/", "en")).toBe("/");
  });
});
