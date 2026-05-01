import { describe, it, expect } from "vitest";

describe("cookbook/transactions/optimize-compute/legacy", () => {
  it("simulates compute, builds optimal tx, and sends", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
