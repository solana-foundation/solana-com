import { describe, it, expect } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/sign-message/web3v3", () => {
  it("signs and verifies a message via Keypair methods", async () => {
    const { calls } = await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
    expect(calls).toContainEqual(["Verified:", true]);
  });
});
