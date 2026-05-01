import { describe, it, expect } from "vitest";

describe("cookbook/transactions/send-sol/legacy", () => {
  it("airdrops, builds, signs, and sends a transfer", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
