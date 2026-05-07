import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/send-sol/legacy", () => {
  it("airdrops, builds, signs, and sends a transfer", async () => {
    await expectExampleLogsSignature(() => import("./legacy"));
  });
});
