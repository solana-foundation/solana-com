import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/calculate-cost/kit", () => {
  it("estimates compute units, calculates fee, and sends", async () => {
    await expectExampleLogsSignature(() => import("./kit"));
  });
});
