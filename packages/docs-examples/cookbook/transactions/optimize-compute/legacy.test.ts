import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/optimize-compute/legacy", () => {
  it("simulates compute, builds optimal tx, and sends", async () => {
    await expectExampleLogsSignature(() => import("./legacy"));
  });
});
