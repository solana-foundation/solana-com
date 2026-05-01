import { describe, it, expect } from "vitest";

describe("cookbook/transactions/add-memo/legacy", () => {
  it("sends a memo transaction", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
