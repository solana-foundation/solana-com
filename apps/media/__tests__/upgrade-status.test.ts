import { describe, expect, it } from "vitest";
import { isPublishedUpgrade } from "@/lib/keystatic/upgrade-status";

describe("isPublishedUpgrade", () => {
  const now = new Date("2026-07-28T00:00:00.000Z");

  it("includes published upgrades whose release time has passed", () => {
    expect(
      isPublishedUpgrade(
        {
          status: "published",
          publishedAt: "2026-07-27T00:00:00.000Z",
        },
        now,
      ),
    ).toBe(true);
  });

  it("excludes drafts and future-dated upgrades", () => {
    expect(
      isPublishedUpgrade(
        {
          status: "draft",
          publishedAt: "2026-07-27T00:00:00.000Z",
        },
        now,
      ),
    ).toBe(false);
    expect(
      isPublishedUpgrade(
        {
          status: "published",
          publishedAt: "2026-07-29T00:00:00.000Z",
        },
        now,
      ),
    ).toBe(false);
  });
});
