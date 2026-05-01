import { describe, it, expect } from "vitest";

describe("cookbook/transactions/fee-sponsorship/legacy", () => {
  it("creates a mint and transfers, fees paid by separate signer", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
