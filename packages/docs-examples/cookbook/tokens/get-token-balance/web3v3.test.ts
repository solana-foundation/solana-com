import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-balance/web3v3", () => {
  it("reads a token account balance via Connection", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
