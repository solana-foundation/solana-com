import { describe, it, expect } from "vitest";

describe("cookbook/accounts/create-account/kit", () => {
  it("runs end-to-end against the local validator", async () => {
    // Importing the example executes its top-level statements. If any RPC call
    // or signing step throws, the import rejects and the test fails — that is
    // exactly the regression signal we want when an SDK API drifts.
    await expect(import("./kit")).resolves.toBeDefined();
  });
});
