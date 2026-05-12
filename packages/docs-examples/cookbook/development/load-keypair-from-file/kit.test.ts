import { describe, it, expect } from "vitest";

describe("cookbook/development/load-keypair-from-file/kit", () => {
  it("loads the CLI keypair and airdrops via Kit", async () => {
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
