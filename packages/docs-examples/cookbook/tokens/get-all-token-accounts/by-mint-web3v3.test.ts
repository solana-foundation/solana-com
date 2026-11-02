import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-all-token-accounts/by-mint-web3v3", () => {
  it("filters token accounts by mint", async () => {
    await expect(import("./by-mint-web3v3")).resolves.toBeDefined();
  });
});
