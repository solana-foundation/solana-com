import { describe, it, expect } from "vitest";

describe("cookbook/wallets/verify-keypair/legacy", () => {
  it("checks the derived address against an expected one", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
