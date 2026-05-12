import { describe, it, expect } from "vitest";

describe("cookbook/accounts/calculate-rent/kit", () => {
  it("runs end-to-end against the local validator", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
