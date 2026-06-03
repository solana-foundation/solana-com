import { describe, it, expect } from "vitest";

describe("cookbook/tokens/get-token-mint/kit", () => {
  it("fetches a Token-2022 mint", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
