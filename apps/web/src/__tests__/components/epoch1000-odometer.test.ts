import { describe, expect, it } from "vitest";
import {
  nextWheelTargets,
  normalizeTargets,
} from "@/components/epoch1000/odometer-math";

/** Strip offsets mod 10 are the digits actually shown on the wheels. */
function shownDigits(targets: number[]): number[] {
  return targets.map((t) => t % 10);
}

describe("epoch odometer wheel math", () => {
  it("first settle spins two revolutions and lands on the value's digits", () => {
    const targets = nextWheelTargets(null, 998, 4);
    expect(targets).toEqual([20, 29, 29, 28]);
    expect(shownDigits(targets)).toEqual([0, 9, 9, 8]);
  });

  it("an epoch tick rolls only the wheels that change, always forward", () => {
    const at998 = nextWheelTargets(null, 998, 4);
    const at999 = nextWheelTargets(at998, 999, 4);
    expect(shownDigits(at999)).toEqual([0, 9, 9, 9]);
    // every wheel moved forward or stayed
    at999.forEach((t, i) => expect(t).toBeGreaterThanOrEqual(at998[i]!));
  });

  it("rolls 999 → 1000 forward on every wheel — the thousands wheel turns", () => {
    const at999 = nextWheelTargets(null, 999, 4);
    const at1000 = nextWheelTargets(at999, 1000, 4);
    expect(shownDigits(at1000)).toEqual([1, 0, 0, 0]);
    at1000.forEach((t, i) => expect(t).toBeGreaterThan(at999[i]!));
  });

  it("normalize folds an offset back one revolution without changing digits", () => {
    const targets = [21, 31, 35, 39];
    const folded = normalizeTargets(targets);
    expect(folded).toEqual([21, 21, 25, 29]);
    expect(shownDigits(folded)).toEqual(shownDigits(targets));
  });
});
