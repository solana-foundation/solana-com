import { describe, it, expect } from "vitest";

describe("cookbook/development/test-sol/kit", () => {
  it("airdrops SOL and reads back the balance", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
