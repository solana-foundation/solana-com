import { describe, it, expect } from "vitest";

describe("cookbook/transactions/add-memo/kit", () => {
  it("sends a memo transaction", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
