import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/restore-keypair/from-base58-web3v3", () => {
  it("restores a Keypair from a base58 string", async () => {
    await runExample(() => import("./from-base58-web3v3"), {
      output: new URL("./from-base58-web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
