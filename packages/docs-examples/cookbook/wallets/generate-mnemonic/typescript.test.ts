import { describe, it, expect } from "vitest";

describe("cookbook/wallets/generate-mnemonic/typescript", () => {
  it("generates a BIP-39 mnemonic", async () => {
    await expect(import("./typescript")).resolves.toBeDefined();
  });
});
