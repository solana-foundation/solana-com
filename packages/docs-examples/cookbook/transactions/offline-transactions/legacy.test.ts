import { describe, it, expect } from "vitest";

describe("cookbook/transactions/offline-transactions/legacy", () => {
  it("creates, signs offline, recovers, and sends a transfer", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
