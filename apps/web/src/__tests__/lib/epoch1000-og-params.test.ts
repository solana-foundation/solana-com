import { describe, expect, it } from "vitest";
import {
  InvalidOgParamsError,
  parseOgCardParams,
} from "@/lib/epoch1000/og-params";

const ADDRESS = "4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T";

describe("parseOgCardParams", () => {
  it("accepts a base58 wallet and bounded epoch numbers", () => {
    const parsed = parseOgCardParams(
      new URLSearchParams({ w: ADDRESS, s: "842", fe: "12", c: "1000" }),
    );
    expect(parsed).toEqual({
      survived: 842,
      firstEpoch: 12,
      currentEpoch: 1000,
      wallet: ADDRESS,
      capped: false,
    });
  });

  it("renders the anonymous card when no wallet is given", () => {
    expect(
      parseOgCardParams(new URLSearchParams({ s: "3" })).wallet,
    ).toBeNull();
    expect(parseOgCardParams(new URLSearchParams({ w: "" })).wallet).toBeNull();
  });

  it("refuses arbitrary text in the wallet slot", () => {
    for (const w of [
      "Claim your reward at sol-rewards.xyz",
      "<script>",
      "0OIl".repeat(10),
      "a".repeat(45),
    ]) {
      expect(() => parseOgCardParams(new URLSearchParams({ w }))).toThrow(
        InvalidOgParamsError,
      );
    }
  });

  it("clamps epoch counters to the campaign window", () => {
    const parsed = parseOgCardParams(
      new URLSearchParams({ s: "999999", fe: "-5", c: "abc" }),
    );
    expect(parsed.survived).toBe(1000);
    expect(parsed.firstEpoch).toBe(0);
    expect(parsed.currentEpoch).toBe(0);
  });
});
