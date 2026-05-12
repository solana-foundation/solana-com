import { describe, it, expect } from "vitest";

describe("cookbook/accounts/get-account-balance/kit", () => {
  it("runs end-to-end against the local validator", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
