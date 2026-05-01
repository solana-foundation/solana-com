import { describe, it, expect } from "vitest";

describe("cookbook/transactions/calculate-cost/kit", () => {
  it("estimates compute units, calculates fee, and sends", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
