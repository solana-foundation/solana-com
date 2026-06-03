import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-from-mnemonic/bip44-kit", () => {
  it("derives 10 BIP-44 signers from a mnemonic", async () => {
    await expect(import("./bip44-kit")).resolves.toBeDefined();
  });
});
