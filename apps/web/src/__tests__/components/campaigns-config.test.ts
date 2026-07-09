import { describe, expect, it } from "vitest";
import {
  CAMPAIGNS,
  getActiveCampaignId,
} from "@/components/index/campaigns/config";

describe("homepage campaign config", () => {
  const epoch1000 = CAMPAIGNS.find((c) => c.id === "epoch1000")!;

  it("activates epoch1000 inside its window", () => {
    expect(getActiveCampaignId(new Date(`${epoch1000.start}T12:00:00Z`))).toBe(
      "epoch1000",
    );
    expect(getActiveCampaignId(new Date(`${epoch1000.end}T12:00:00Z`))).toBe(
      "epoch1000",
    );
  });

  it("falls back to the default hero before the window opens", () => {
    const dayBefore = new Date(`${epoch1000.start}T00:00:00Z`);
    dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);
    expect(getActiveCampaignId(dayBefore)).toBeNull();
  });

  it("falls back to the default hero after the window closes", () => {
    const dayAfter = new Date(`${epoch1000.end}T00:00:00Z`);
    dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);
    expect(getActiveCampaignId(dayAfter)).toBeNull();
  });

  it("keeps windows as valid ISO dates", () => {
    for (const c of CAMPAIGNS) {
      expect(new Date(`${c.start}T00:00:00Z`).getTime()).not.toBeNaN();
      expect(new Date(`${c.end}T00:00:00Z`).getTime()).not.toBeNaN();
      expect(c.start <= c.end).toBe(true);
    }
  });
});
