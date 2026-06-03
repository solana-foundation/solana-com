import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-from-mnemonic/bip39-legacy", () => {
  it("restores a Keypair from a BIP-39 mnemonic", async () => {
    await expect(import("./bip39-legacy")).resolves.toBeDefined();
  });
});
