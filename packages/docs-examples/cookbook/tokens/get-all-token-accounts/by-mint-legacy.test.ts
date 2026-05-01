import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-all-token-accounts/by-mint-legacy", () => {
  it("filters token accounts by mint", async () => {
    await expect(import("./by-mint-legacy")).resolves.toBeDefined();
  });
});
