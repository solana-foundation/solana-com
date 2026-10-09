import { describe, it, expect } from "vitest";

describe("cookbook/development/connect-environment/web3v3", () => {
  it("creates a Connection without throwing", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
