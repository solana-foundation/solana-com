import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/accounts/create-account/web3v3", () => {
  it("runs end-to-end and logs a valid tx signature", async () => {
    await expectExampleLogsSignature(() => import("./web3v3"));
  });
});
