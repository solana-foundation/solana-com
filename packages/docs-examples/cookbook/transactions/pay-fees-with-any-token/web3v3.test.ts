import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/pay-fees-with-any-token/web3v3", () => {
  it("creates a mint, transfers, and pays fees in tokens", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
  });
});
