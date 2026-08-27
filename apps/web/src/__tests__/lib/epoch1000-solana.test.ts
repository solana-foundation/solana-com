import { describe, expect, it } from "vitest";
import { slotsUntilEpoch, type EpochInfo } from "@/lib/epoch1000/solana";

const baseEpochInfo: EpochInfo = {
  epoch: 999,
  slotIndex: 10,
  slotsInEpoch: 432_000,
  absoluteSlot: 431_568_010,
};

describe("epoch1000 Solana helpers", () => {
  it("reports slots remaining before the target epoch", () => {
    expect(slotsUntilEpoch(1000, baseEpochInfo)).toBe(431_990);
  });

  it("clamps slots remaining to zero after the target epoch", () => {
    expect(
      slotsUntilEpoch(1000, {
        ...baseEpochInfo,
        epoch: 1000,
        slotIndex: 1,
      }),
    ).toBe(0);
    expect(
      slotsUntilEpoch(1000, {
        ...baseEpochInfo,
        epoch: 1001,
        slotIndex: 0,
      }),
    ).toBe(0);
  });
});
