import { describe, it, expect } from "vitest";

describe("cookbook/development/connect-environment/web3v3-moniker", () => {
  it("creates a Connection from a moniker without throwing", async () => {
    await expect(import("./web3v3-moniker")).resolves.toBeDefined();
  });
});
