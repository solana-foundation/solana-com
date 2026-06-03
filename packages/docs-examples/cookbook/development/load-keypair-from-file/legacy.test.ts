import { describe, it, expect } from "vitest";

describe("cookbook/development/load-keypair-from-file/legacy", () => {
  it("loads the CLI keypair and airdrops via Connection", async () => {
    await expect(import("./legacy")).resolves.toBeDefined();
  });
});
