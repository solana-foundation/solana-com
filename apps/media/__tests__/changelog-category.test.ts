import { describe, expect, it } from "vitest";
import { isChangelogCategory } from "@/lib/changelog";

describe("isChangelogCategory", () => {
  it("matches changelog names and slugs without case sensitivity", () => {
    expect(isChangelogCategory("Changelog")).toBe(true);
    expect(isChangelogCategory("changelog")).toBe(true);
    expect(isChangelogCategory("  CHANGELOG ")).toBe(true);
  });

  it("does not match other or missing categories", () => {
    expect(isChangelogCategory("Developers")).toBe(false);
    expect(isChangelogCategory(null)).toBe(false);
  });
});
