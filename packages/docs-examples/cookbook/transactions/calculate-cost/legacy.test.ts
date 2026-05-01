import { describe, it, expect } from "vitest";

describe("cookbook/transactions/calculate-cost/legacy", () => {
  it("simulates, calculates fee, sends a transfer", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
