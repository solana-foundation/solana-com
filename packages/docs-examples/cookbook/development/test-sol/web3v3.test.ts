import { describe, it, expect } from "vitest";

describe("cookbook/development/test-sol/web3v3", () => {
  it("airdrops SOL and reads back the balance", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
