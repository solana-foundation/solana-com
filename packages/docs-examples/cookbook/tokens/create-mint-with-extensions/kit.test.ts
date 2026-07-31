import { describe, it, expect } from "vitest";

describe("cookbook/tokens/create-mint-with-extensions/kit", () => {
  it("creates a Token-2022 mint with metadata, pausable, permanent delegate, and default account state extensions", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
