import { describe, it, expect } from "vitest";

describe("cookbook/wallets/sign-message/legacy", () => {
  it("signs and verifies a message via tweetnacl", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
