import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/optimize-compute/web3v3", () => {
  it("simulates compute, builds optimal tx, and sends", async () => {
    await expectExampleLogsSignature(() => import("./web3v3"));
  });
});
