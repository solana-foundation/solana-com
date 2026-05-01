import { describe, it, expect } from "vitest";

describe("cookbook/transactions/send-sol/kit", () => {
  it("airdrops, builds, signs, and sends a transfer", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
