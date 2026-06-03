import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/add-priority-fees/kit", () => {
  it("estimates compute, sets a priority fee, sends a memo tx", async () => {
    await expectExampleLogsSignature(() => import("./kit"));
  });
});
