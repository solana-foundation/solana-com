import { describe, it, expect } from "vitest";

describe("cookbook/tokens/create-token-with-metadata/kit", () => {
  it("creates a fungible token with Metaplex metadata", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
