import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/add-priority-fees/web3v3", () => {
  it("sets compute limits and priority fee, transfers SOL", async () => {
    await expectExampleLogsSignature(() => import("./web3v3"));
  });
});
