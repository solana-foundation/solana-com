import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/restore-keypair/from-bytes-web3v3", () => {
  it("restores a Keypair from raw bytes", async () => {
    await runExample(() => import("./from-bytes-web3v3"), {
      output: new URL("./from-bytes-web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
