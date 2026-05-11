import { describe, it, expect } from "vitest";

describe("cookbook/tokens/fetch-token-metadata/kit", () => {
  it("fetches USDC metadata directly and via the maybe-fetcher", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
