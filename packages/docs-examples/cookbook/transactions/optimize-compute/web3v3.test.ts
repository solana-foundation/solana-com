import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/optimize-compute/web3v3", () => {
  it("simulates compute, builds optimal tx, and sends", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
  });
});
