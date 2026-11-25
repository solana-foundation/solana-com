import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/tokens/get-all-token-accounts/by-mint-web3v3", () => {
  it("filters token accounts by mint", async () => {
    await runExample(() => import("./by-mint-web3v3"), {
      output: new URL("./by-mint-web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
