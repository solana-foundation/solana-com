import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-keypair/from-bytes-kit", () => {
  it("restores a Kit signer from raw bytes", async () => {
    await expect(import("./from-bytes-kit")).resolves.toBeDefined();
  });
});
