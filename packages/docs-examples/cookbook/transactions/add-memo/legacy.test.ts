import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/add-memo/legacy", () => {
  it("sends a memo transaction and logs a valid signature", async () => {
    await expectExampleLogsSignature(() => import("./legacy"));
  });
});
