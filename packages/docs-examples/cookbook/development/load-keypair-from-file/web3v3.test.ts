import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/development/load-keypair-from-file/web3v3", () => {
  it("loads the CLI keypair and airdrops via Connection", async () => {
    // The CLI keypair is shared with the other examples, so its balance (and
    // whether the "Balance low" airdrop line prints) depends on which ran
    // first. The block is not runnable, so the output is recorded but its
    // shape is not checked.
    await runExample(() => import("./web3v3"), {
      signatures: "none",
      ...(process.env.RECORD_OUTPUT === "1" && {
        output: new URL("./web3v3.output.txt", import.meta.url),
      }),
    });
  });
});
