import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/fee-sponsorship/web3v3", () => {
  it("creates a mint and transfers, fees paid by separate signer", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
  });
});
