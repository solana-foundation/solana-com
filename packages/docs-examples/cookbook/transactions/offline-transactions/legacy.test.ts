import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/offline-transactions/legacy", () => {
  it("creates, signs offline, recovers, and sends a transfer", async () => {
    await expectExampleLogsSignature(() => import("./legacy"));
  });
});
