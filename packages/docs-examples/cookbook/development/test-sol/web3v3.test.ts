import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/development/test-sol/web3v3", () => {
  it("airdrops SOL and reads back the balance", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
