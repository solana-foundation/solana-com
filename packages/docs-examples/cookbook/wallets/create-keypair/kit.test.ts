import { describe, it, expect } from "vitest";

describe("cookbook/wallets/create-keypair/kit", () => {
  it("generates a fresh keypair signer", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
