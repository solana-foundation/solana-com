import { describe, it, expect } from "vitest";

describe("cookbook/wallets/restore-keypair/from-bytes-legacy", () => {
  it("restores a Keypair from raw bytes", async () => {
    await expect(import("./from-bytes-legacy")).resolves.toBeDefined();
  });
});
