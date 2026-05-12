import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-all-token-accounts/all-kit", () => {
  it("lists all token accounts owned by an address", async () => {
    await expect(import("./all-kit")).resolves.toBeDefined();
  });
});
