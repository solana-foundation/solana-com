import { describe, it, expect } from "vitest";

describe("cookbook/wallets/create-keypair/legacy", () => {
  it("generates a fresh Keypair", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
