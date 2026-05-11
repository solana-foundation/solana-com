import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-account/legacy", () => {
  it("fetches a Token-2022 token account", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
