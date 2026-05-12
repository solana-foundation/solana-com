import { describe, it, expect } from "vitest";

describe("cookbook/development/connect-environment/kit", () => {
  it("creates RPC clients without throwing", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
