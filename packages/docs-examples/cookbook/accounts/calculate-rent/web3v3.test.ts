import { describe, it, expect } from "vitest";

describe("cookbook/accounts/calculate-rent/web3v3", () => {
  it("runs end-to-end against the local validator", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
