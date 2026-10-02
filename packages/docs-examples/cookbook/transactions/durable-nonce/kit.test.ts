import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/durable-nonce/kit", () => {
  it("creates and uses a durable nonce transaction", async () => {
    await expectExampleLogsSignature(() => import("./kit"));
  });
});
