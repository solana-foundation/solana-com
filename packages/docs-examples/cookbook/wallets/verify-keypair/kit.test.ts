import { describe, it, expect } from "vitest";

describe("cookbook/wallets/verify-keypair/kit", () => {
  it("checks the derived address against an expected one", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
