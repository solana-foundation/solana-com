import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/partial-signing/legacy", () => {
  it("collects independent signatures and submits the transaction", async () => {
    await expectExampleLogsSignature(() => import("./legacy"));
  });
});
