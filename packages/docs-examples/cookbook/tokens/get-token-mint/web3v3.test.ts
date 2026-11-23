import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-mint/web3v3", () => {
  it("fetches a Token-2022 mint", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
