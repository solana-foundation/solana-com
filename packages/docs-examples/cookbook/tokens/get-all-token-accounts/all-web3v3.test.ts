import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-all-token-accounts/all-web3v3", () => {
  it("lists all token accounts owned by an address", async () => {
    await expect(import("./all-web3v3")).resolves.toBeDefined();
  });
});
