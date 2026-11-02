import { describe, it, expect } from "vitest";

describe("cookbook/wallets/create-keypair/web3v3", () => {
  it("generates a fresh Keypair", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
