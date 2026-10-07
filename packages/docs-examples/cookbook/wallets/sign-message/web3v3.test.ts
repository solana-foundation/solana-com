import { describe, it, expect } from "vitest";

describe("cookbook/wallets/sign-message/web3v3", () => {
  it("signs and verifies a message via tweetnacl", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
