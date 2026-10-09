import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/pay-fees-with-any-token/web3v3", () => {
  it("creates a mint, transfers, and pays fees in tokens", async () => {
    await expectExampleLogsSignature(() => import("./web3v3"));
  });
});
