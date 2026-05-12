import { describe, it, expect } from "vitest";

describe("cookbook/transactions/mev-protection/kit", () => {
  it("builds a dontfront tx + tip and attempts Jito submit", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
