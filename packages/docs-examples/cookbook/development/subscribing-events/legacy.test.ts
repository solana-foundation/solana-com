import { describe, it, expect } from "vitest";

describe("cookbook/development/subscribing-events/legacy", () => {
  it("subscribes, airdrops, then unsubscribes", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
