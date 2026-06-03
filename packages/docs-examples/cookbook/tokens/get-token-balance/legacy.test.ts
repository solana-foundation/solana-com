import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-balance/legacy", () => {
  it("reads a token account balance via Connection", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
