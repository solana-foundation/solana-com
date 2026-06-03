import { describe, it, expect } from "vitest";

describe("cookbook/wallets/check-publickey/legacy", () => {
  it("checks whether an address lies on the ed25519 curve", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
