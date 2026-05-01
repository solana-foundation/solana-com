import { describe, it, expect } from "vitest";

describe("cookbook/accounts/create-account/legacy", () => {
  it("runs end-to-end against the local validator", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
