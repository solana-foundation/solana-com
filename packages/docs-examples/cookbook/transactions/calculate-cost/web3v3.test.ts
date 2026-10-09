import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/calculate-cost/web3v3", () => {
  it("simulates, calculates fee, sends a transfer", async () => {
    await expectExampleLogsSignature(() => import("./web3v3"));
  });
});
