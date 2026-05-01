import { describe, it, expect } from "vitest";

describe("cookbook/transactions/fee-sponsorship/kit", () => {
  it("creates a mint and transfers, fees paid by separate signer", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
