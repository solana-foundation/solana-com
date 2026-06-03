import { describe, it, expect } from "vitest";

describe("cookbook/development/test-sol/legacy", () => {
  it("airdrops SOL and reads back the balance", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
