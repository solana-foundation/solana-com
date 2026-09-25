import { afterEach, describe, expect, it, vi } from "vitest";
import {
  campaignMessage,
  getAwardsCampaignStatus,
} from "@/lib/awards-campaign";

const originalEnvironment = { ...process.env };

afterEach(() => {
  vi.unstubAllEnvs();
  process.env = { ...originalEnvironment };
});

describe("awards campaign", () => {
  it("is open when no campaign window is configured", () => {
    expect(getAwardsCampaignStatus(new Date("2026-09-10T00:00:00Z"))).toBe(
      "open",
    );
  });

  it("enforces the configured opening and closing times", () => {
    vi.stubEnv("AWARDS_NOMINATIONS_OPENS_AT", "2026-09-11T00:00:00Z");
    vi.stubEnv("AWARDS_NOMINATIONS_CLOSES_AT", "2026-09-12T00:00:00Z");

    expect(getAwardsCampaignStatus(new Date("2026-09-10T23:59:59Z"))).toBe(
      "not_started",
    );
    expect(getAwardsCampaignStatus(new Date("2026-09-11T12:00:00Z"))).toBe(
      "open",
    );
    expect(getAwardsCampaignStatus(new Date("2026-09-12T00:00:00Z"))).toBe(
      "closed",
    );
  });

  it("provides a clear closed message", () => {
    expect(campaignMessage("closed")).toMatch(/closed/i);
  });
});
