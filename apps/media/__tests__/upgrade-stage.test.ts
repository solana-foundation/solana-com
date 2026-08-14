import { describe, expect, it } from "vitest";
import {
  isUpgradeStage,
  STAGE_BADGE_CLASSES,
  STAGE_LABELS,
} from "@/lib/upgrades/stage";

describe("upgrade stage helper", () => {
  it("has a label and badge class for all four stages", () => {
    const stages = [
      "planned",
      "in_development",
      "live",
      "action_required",
    ] as const;
    for (const stage of stages) {
      expect(STAGE_LABELS[stage]).toBeTruthy();
      expect(STAGE_BADGE_CLASSES[stage]).toBeTruthy();
    }
  });

  it("validates stage values from untrusted content data", () => {
    expect(isUpgradeStage("live")).toBe(true);
    expect(isUpgradeStage("mainnet-live")).toBe(false);
    expect(isUpgradeStage(undefined)).toBe(false);
  });
});
