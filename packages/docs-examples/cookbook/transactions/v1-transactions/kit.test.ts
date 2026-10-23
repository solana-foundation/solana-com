import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/v1-transactions/kit", () => {
  it("sends a v1 transfer and reads its config back", async () => {
    await expectExampleLogsSignature(() => import("./kit"));
  });
});
