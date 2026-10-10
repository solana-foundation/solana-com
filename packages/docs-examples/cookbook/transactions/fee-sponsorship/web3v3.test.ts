import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/fee-sponsorship/web3v3", () => {
  it("creates a mint and transfers, fees paid by separate signer", async () => {
    await expectExampleLogsSignature(() => import("./web3v3"));
  });
});
