import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/create-keypair/web3v3", () => {
  it("generates a fresh Keypair", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
