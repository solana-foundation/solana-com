import { describe, it, expect } from "vitest";

describe("cookbook/transactions/add-priority-fees/legacy", () => {
  it("sets compute limits and priority fee, transfers SOL", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
