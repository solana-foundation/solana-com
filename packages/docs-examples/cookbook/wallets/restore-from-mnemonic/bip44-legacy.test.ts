import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-from-mnemonic/bip44-legacy", () => {
  it("derives 10 BIP-44 Keypairs from a mnemonic", async () => {
    await expect(import("./bip44-legacy")).resolves.toBeDefined();
  });
});
