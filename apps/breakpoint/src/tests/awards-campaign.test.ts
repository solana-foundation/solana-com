import { afterEach, describe, expect, it, vi } from "vitest";
import {
  campaignMessage,
  defaultVotingWindow,
  getAwardsCampaignStatus,
  getAwardsVotingStatus,
} from "@/lib/awards-campaign";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("awards campaign", () => {
  it("keeps nominations open until voting begins", () => {
    const opening = new Date(defaultVotingWindow.opensAt);
    const beforeOpening = new Date(opening.getTime() - 1);

    expect(getAwardsCampaignStatus(beforeOpening)).toBe("open");
    expect(getAwardsVotingStatus(beforeOpening)).toBe("not_started");
    expect(getAwardsCampaignStatus(opening)).toBe("closed");
    expect(getAwardsVotingStatus(opening)).toBe("open");
  });

  it("closes voting at the configured end", () => {
    const closing = new Date(defaultVotingWindow.closesAt);
    const beforeClosing = new Date(closing.getTime() - 1);

    expect(getAwardsVotingStatus(beforeClosing)).toBe("open");
    expect(getAwardsVotingStatus(closing)).toBe("closed");
  });

  it("ignores legacy date environment variables", () => {
    vi.stubEnv("AWARDS_NOMINATIONS_OPENS_AT", "2027-01-01T00:00:00Z");
    vi.stubEnv("AWARDS_NOMINATIONS_CLOSES_AT", "2027-01-02T00:00:00Z");
    vi.stubEnv("AWARDS_VOTING_OPENS_AT", "2027-01-03T00:00:00Z");
    vi.stubEnv("AWARDS_VOTING_CLOSES_AT", "2027-01-04T00:00:00Z");

    const opening = new Date(defaultVotingWindow.opensAt);
    expect(getAwardsCampaignStatus(opening)).toBe("closed");
    expect(getAwardsVotingStatus(opening)).toBe("open");
  });

  it("provides a clear closed message", () => {
    expect(campaignMessage("closed")).toMatch(/closed/i);
  });
});
