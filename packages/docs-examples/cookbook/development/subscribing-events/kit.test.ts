import { describe, it, expect } from "vitest";

describe("cookbook/development/subscribing-events/kit", () => {
  it("subscribes, airdrops, observes, then aborts", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
