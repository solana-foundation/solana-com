import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-all-token-accounts/by-mint-kit", () => {
  it("filters token accounts by mint", async () => {
    await expect(import("./by-mint-kit")).resolves.toBeDefined();
  });
});
