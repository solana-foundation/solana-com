import { describe, expect, it } from "vitest";
import { blockAgeAtReceipt } from "../../components/slot200/blockAge";

describe("blockAgeAtReceipt", () => {
  it("preserves the age of a cached response without using the visitor's clock", () => {
    const serverTime = Date.parse("2026-10-06T00:00:00Z");
    const headers = new Headers({
      Date: "Tue, 06 Oct 2026 00:00:02 GMT",
      Age: "38",
    });

    expect(blockAgeAtReceipt(serverTime, headers)).toBe(40_000);
  });

  it("does not claim a sample is live without a server response date", () => {
    expect(
      blockAgeAtReceipt(Date.now(), new Headers({ Age: "30" })),
    ).toBeNull();
  });

  it("clamps response date rounding and ignores invalid cache ages", () => {
    const serverTime = Date.parse("2026-10-06T00:00:00.900Z");
    const headers = new Headers({
      Date: "Tue, 06 Oct 2026 00:00:00 GMT",
      Age: "unknown",
    });

    expect(blockAgeAtReceipt(serverTime, headers)).toBe(0);
  });
});
