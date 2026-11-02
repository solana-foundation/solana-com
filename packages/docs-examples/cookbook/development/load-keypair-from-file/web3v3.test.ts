import { describe, it, expect } from "vitest";

describe("cookbook/development/load-keypair-from-file/web3v3", () => {
  it("loads the CLI keypair and airdrops via Connection", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
