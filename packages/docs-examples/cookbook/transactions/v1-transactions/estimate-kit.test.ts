import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/v1-transactions/estimate-kit", () => {
  it("estimates v1 resource limits by simulation and sends", async () => {
    await expectExampleLogsSignature(() => import("./estimate-kit"));
  });
});
