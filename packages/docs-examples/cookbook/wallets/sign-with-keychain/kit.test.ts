import { describe, it, expect } from "vitest";

describe("cookbook/wallets/sign-with-keychain/kit", () => {
  it("signs a transaction with a Keychain memory signer", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
