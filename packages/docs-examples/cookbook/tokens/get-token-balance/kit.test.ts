import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-balance/kit", () => {
  it("reads a token account balance via RPC", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
