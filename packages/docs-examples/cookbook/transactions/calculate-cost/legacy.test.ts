import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/calculate-cost/legacy", () => {
  it("simulates, calculates fee, sends a transfer", async () => {
    await expectExampleLogsSignature(() => import("./legacy"));
  });
});
