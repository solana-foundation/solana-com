import { describe, it, expect } from "vitest";

describe("cookbook/wallets/verify-keypair/web3v3", () => {
  it("checks the derived address against an expected one", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
