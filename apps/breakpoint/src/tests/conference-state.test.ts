import { describe, expect, it } from "vitest";
import {
  CONFERENCE_STATE,
  isLiveConference,
  isProductionDeployment,
  resolveConferenceState,
} from "@/content/conference-state";

describe("conference state", () => {
  it("ships the marketing edition until the live flip is merged", () => {
    expect(CONFERENCE_STATE).toBe("pre");
    expect(isLiveConference()).toBe(false);
  });

  it("treats only the live state as live", () => {
    expect(isLiveConference("pre")).toBe(false);
    expect(isLiveConference("post")).toBe(false);
    expect(isLiveConference("live")).toBe(true);
  });
});

describe("resolveConferenceState", () => {
  it("shows the requested edition outside production", () => {
    expect(
      resolveConferenceState({ preview: "live" }, { production: false }),
    ).toBe("live");
    expect(
      resolveConferenceState({ preview: ["post"] }, { production: false }),
    ).toBe("post");
  });

  it("falls back to the shipped edition without a valid preview", () => {
    expect(resolveConferenceState(undefined, { production: false })).toBe(
      CONFERENCE_STATE,
    );
    expect(
      resolveConferenceState({ preview: "tomorrow" }, { production: false }),
    ).toBe(CONFERENCE_STATE);
    expect(
      resolveConferenceState(
        { preview: "pre" },
        { production: false, shipped: "live" },
      ),
    ).toBe("pre");
  });

  it("ignores the preview parameter in production", () => {
    expect(
      resolveConferenceState({ preview: "live" }, { production: true }),
    ).toBe(CONFERENCE_STATE);
  });

  it("recognises only the production Vercel environment", () => {
    expect(isProductionDeployment({ VERCEL_ENV: "production" })).toBe(true);
    expect(isProductionDeployment({ VERCEL_ENV: "preview" })).toBe(false);
    expect(isProductionDeployment({})).toBe(false);
  });
});
