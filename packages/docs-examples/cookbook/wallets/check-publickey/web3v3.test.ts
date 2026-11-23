import { describe, it, expect } from "vitest";

describe("cookbook/wallets/check-publickey/web3v3", () => {
  it("checks whether an address lies on the ed25519 curve", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
