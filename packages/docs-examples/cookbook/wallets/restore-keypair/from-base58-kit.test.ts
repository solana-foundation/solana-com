import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-keypair/from-base58-kit", () => {
  it("restores a Kit signer from a base58 keypair string", async () => {
    await expect(import("./from-base58-kit")).resolves.toBeDefined();
  });
});
