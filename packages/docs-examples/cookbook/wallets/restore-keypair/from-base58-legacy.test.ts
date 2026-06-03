import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-keypair/from-base58-legacy", () => {
  it("restores a Keypair from a base58 string", async () => {
    await expect(import("./from-base58-legacy")).resolves.toBeDefined();
  });
});
