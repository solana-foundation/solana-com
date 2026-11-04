import { describe, expect, it } from "vitest";
import { CONFERENCE_STATE, isLiveConference } from "@/content/conference-state";

describe("conference state", () => {
  it("ships the live edition of the home page", () => {
    expect(CONFERENCE_STATE).toBe("live");
    expect(isLiveConference()).toBe(true);
  });

  it("treats only the live state as live", () => {
    expect(isLiveConference("pre")).toBe(false);
    expect(isLiveConference("post")).toBe(false);
    expect(isLiveConference("live")).toBe(true);
  });
});
