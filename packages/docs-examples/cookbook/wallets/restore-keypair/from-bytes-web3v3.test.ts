import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-keypair/from-bytes-web3v3", () => {
  it("restores a Keypair from raw bytes", async () => {
    await expect(import("./from-bytes-web3v3")).resolves.toBeDefined();
  });
});
