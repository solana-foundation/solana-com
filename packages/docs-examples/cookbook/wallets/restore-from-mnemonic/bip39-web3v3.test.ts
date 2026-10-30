import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/restore-from-mnemonic/bip39-web3v3", () => {
  it("restores a Keypair from a BIP-39 mnemonic", async () => {
    await runExample(() => import("./bip39-web3v3"), {
      output: new URL("./bip39-web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
