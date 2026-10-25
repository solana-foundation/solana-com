import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/calculate-cost/web3v3", () => {
  it("simulates, calculates fee, sends a transfer", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
  });
});
