import { describe, it, expect } from "vitest";

describe("cookbook/development/subscribing-events/web3v3", () => {
  it("subscribes, airdrops, then unsubscribes", async () => {
    await expect(import("./web3v3")).resolves.toBeDefined();
  });
});
