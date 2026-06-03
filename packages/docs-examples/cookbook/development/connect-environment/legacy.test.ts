import { describe, it, expect } from "vitest";

describe("cookbook/development/connect-environment/legacy", () => {
  it("creates a Connection without throwing", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
