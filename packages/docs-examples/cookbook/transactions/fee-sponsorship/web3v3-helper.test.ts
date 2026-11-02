import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/fee-sponsorship/web3v3-helper", () => {
  it("uses @solana-program/token helpers, fees paid by separate signer", async () => {
    await expectExampleLogsSignature(() => import("./web3v3-helper"));
  });
});
