import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/accounts/get-account-balance/web3v3", () => {
  it("runs end-to-end against the local validator", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
