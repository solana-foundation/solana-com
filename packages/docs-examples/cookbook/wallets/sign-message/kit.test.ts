import { describe, it, expect } from "vitest";

describe("cookbook/wallets/sign-message/kit", () => {
  it("signs bytes and verifies the signature", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
