import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/restore-from-mnemonic/bip44-web3v3", () => {
  it("derives 10 BIP-44 Keypairs from a mnemonic", async () => {
    await runExample(() => import("./bip44-web3v3"), {
      output: new URL("./bip44-web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
