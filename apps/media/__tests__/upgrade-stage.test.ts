import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { isUpgradeStage, STAGE_BADGE_CLASSES } from "@/lib/upgrades/stage";

const messages = JSON.parse(
  readFileSync(
    path.join(
      __dirname,
      "../../../packages/i18n/messages/media/en/common.json",
    ),
    "utf8",
  ),
);

describe("upgrade stage helper", () => {
  it("has a translated label and badge class for all four stages", () => {
    const stages = [
      "planned",
      "in_development",
      "pending_activation",
      "live",
    ] as const;
    for (const stage of stages) {
      expect(messages.upgrades.stage[stage]).toBeTruthy();
      expect(STAGE_BADGE_CLASSES[stage]).toBeTruthy();
    }
  });

  it("validates stage values from untrusted content data", () => {
    expect(isUpgradeStage("live")).toBe(true);
    expect(isUpgradeStage("pending_activation")).toBe(true);
    expect(isUpgradeStage("mainnet-live")).toBe(false);
    expect(isUpgradeStage("action_required")).toBe(false);
    expect(isUpgradeStage(undefined)).toBe(false);
  });
});
