import { describe, expect, it } from "vitest";
import { getEpochEndSlot } from "@/lib/slot200/rpc";

describe("getEpochEndSlot", () => {
  it("returns the first slot of the following epoch", () => {
    expect(
      getEpochEndSlot({
        epoch: 1023,
        absoluteSlot: 442_123_456,
        slotIndex: 123_456,
        slotsInEpoch: 432_000,
      }),
    ).toBe(442_432_000);
  });
});
