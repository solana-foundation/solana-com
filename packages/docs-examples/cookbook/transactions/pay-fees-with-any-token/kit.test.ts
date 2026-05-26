import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/pay-fees-with-any-token/kit", () => {
  it("creates a mint, transfers, and pays fees in tokens", async () => {
    await expectExampleLogsSignature(() => import("./kit"));
  });
});
