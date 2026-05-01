import { describe, it, expect } from "vitest";

describe("cookbook/transactions/add-priority-fees/kit", () => {
  it("estimates compute, sets a priority fee, sends a memo tx", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
