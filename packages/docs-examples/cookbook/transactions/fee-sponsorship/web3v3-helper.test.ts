import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/fee-sponsorship/web3v3-helper", () => {
  it("uses @solana-program/token helpers, fees paid by separate signer", async () => {
    await runExample(() => import("./web3v3-helper"), {
      output: new URL("./web3v3-helper.output.txt", import.meta.url),
    });
  });
});
