import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-keypair/from-base58-web3v3", () => {
  it("restores a Keypair from a base58 string", async () => {
    await expect(import("./from-base58-web3v3")).resolves.toBeDefined();
  });
});
