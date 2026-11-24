import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/check-publickey/web3v3", () => {
  it("checks whether an address lies on the ed25519 curve", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
