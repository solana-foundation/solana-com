import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/add-priority-fees/legacy", () => {
  it("sets compute limits and priority fee, transfers SOL", async () => {
    await expectExampleLogsSignature(() => import("./legacy"));
  });
});
