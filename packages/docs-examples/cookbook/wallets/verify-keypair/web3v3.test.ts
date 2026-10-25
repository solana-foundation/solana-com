import { describe, it, expect } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/verify-keypair/web3v3", () => {
  it("checks the derived address against an expected one", async () => {
    const { calls } = await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
    expect(calls).toContainEqual([true]);
  });
});
