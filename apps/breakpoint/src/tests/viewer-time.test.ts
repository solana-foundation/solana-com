import { describe, expect, it } from "vitest";
import { formatOffsetDuration, viewerTimes } from "@/lib/viewer-time";

const DAY_ONE = "2026-11-16";

describe("viewerTimes", () => {
  it("is null for London and before the browser zone is known", () => {
    expect(viewerTimes(DAY_ONE, "Europe/London", "en")).toBeNull();
    expect(viewerTimes(DAY_ONE, null, "en")).toBeNull();
  });

  it("places sessions on a New York clock", () => {
    const viewer = viewerTimes(DAY_ONE, "America/New_York", "en");
    expect(viewer).not.toBeNull();
    expect(viewer?.differenceMinutes).toBe(-5 * 60);
    expect(viewer?.place).toBe("New York");
    expect(viewer?.zoneName).toBe("EST");
    expect(viewer?.showLocal).toBe(true);
    expect(viewer?.time(9 * 60)).toBe("04:00");
    expect(viewer?.range(9 * 60, 9 * 60 + 30)).toBe("04:00–04:30");
  });

  it("handles half-hour zones and days that roll over", () => {
    const viewer = viewerTimes(DAY_ONE, "Asia/Kolkata", "en");
    expect(viewer?.differenceMinutes).toBe(5 * 60 + 30);
    expect(viewer?.time(18 * 60 + 30)).toBe("00:00");
  });

  it("keeps the note but hides local times for zones on London time", () => {
    const viewer = viewerTimes(DAY_ONE, "Europe/Lisbon", "en");
    expect(viewer?.differenceMinutes).toBe(0);
    expect(viewer?.showLocal).toBe(false);
    expect(viewer?.place).toBe("Lisbon");
  });
});

describe("formatOffsetDuration", () => {
  it("spells out hours and minutes", () => {
    expect(formatOffsetDuration(5 * 60, "en")).toBe("5 hours");
    expect(formatOffsetDuration(-60, "en")).toBe("1 hour");
    expect(formatOffsetDuration(5 * 60 + 30, "en")).toBe("5 hours 30 minutes");
    expect(formatOffsetDuration(45, "en")).toBe("45 minutes");
  });
});
