import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/send-sol/kit", () => {
  it("airdrops, builds, signs, and sends a transfer", async () => {
    await expectExampleLogsSignature(() => import("./kit"));
  });
});
