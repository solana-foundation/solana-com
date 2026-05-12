import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-from-mnemonic/bip39-kit", () => {
  it("restores a Kit signer from a BIP-39 mnemonic", async () => {
    await expect(import("./bip39-kit")).resolves.toBeDefined();
  });
});
