import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/send-sol/web3v3", () => {
  it("airdrops, builds, signs, and sends a transfer", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
  });
});
