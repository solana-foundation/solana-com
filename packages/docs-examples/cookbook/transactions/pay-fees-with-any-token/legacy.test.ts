import { describe, it, expect } from "vitest";

describe("cookbook/transactions/pay-fees-with-any-token/legacy", () => {
  it("creates a mint, transfers, and pays fees in tokens", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
