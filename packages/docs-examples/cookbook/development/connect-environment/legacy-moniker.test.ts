import { describe, it, expect } from "vitest";

describe("cookbook/development/connect-environment/legacy-moniker", () => {
  it("creates a Connection from a moniker without throwing", async () => {
    await expect(import("./legacy-moniker")).resolves.toBeDefined();
  });
});
