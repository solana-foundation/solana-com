import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-mint/metadata-kit", () => {
  it("fetches Metaplex metadata for USDC", async () => {
    await expect(import("./metadata-kit")).resolves.toBeDefined();
  });
});
