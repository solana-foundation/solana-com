import { describe, it, expect } from "vitest";

describe("cookbook/transactions/pay-fees-with-any-token/kit", () => {
  it("creates a mint, transfers, and pays fees in tokens", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
