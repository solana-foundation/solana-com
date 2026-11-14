import { describe, it, expect } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/tokens/fetch-token-metadata/offchain-kit", () => {
  it("fetches onchain metadata then resolves the off-chain JSON", async () => {
    const { text } = await runExample(() => import("./offchain-kit"), {
      signatures: "none",
    });
    expect(text).toMatch(/^Name: Pyth Network$/m);
    expect(text).toMatch(/^Image: https:\/\//m);
  });
});
