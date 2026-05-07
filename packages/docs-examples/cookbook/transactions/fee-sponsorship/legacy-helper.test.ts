import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/fee-sponsorship/legacy-helper", () => {
  it("uses spl-token helpers, fees paid by separate signer", async () => {
    await expectExampleLogsSignature(() => import("./legacy-helper"));
  });
});
