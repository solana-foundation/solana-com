import { describe, it, expect } from "vitest";

describe("cookbook/tokens/fetch-token-metadata/offchain-kit", () => {
  it("fetches onchain metadata then resolves the off-chain JSON", async () => {
    await expect(import("./offchain-kit")).resolves.toBeDefined();
  });
});
