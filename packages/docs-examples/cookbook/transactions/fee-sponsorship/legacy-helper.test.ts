import { describe, it, expect } from "vitest";

describe("cookbook/transactions/fee-sponsorship/legacy-helper", () => {
  it("uses spl-token helpers, fees paid by separate signer", async () => {
    await expect(import("./legacy-helper")).resolves.toBeDefined();
  });
});
