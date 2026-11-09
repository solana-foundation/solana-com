import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-account/web3v3", () => {
  it("fetches a Token-2022 token account", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
