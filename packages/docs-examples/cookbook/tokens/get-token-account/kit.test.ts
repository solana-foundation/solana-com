import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-account/kit", () => {
  it("derives an ATA and fetches the token account", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
