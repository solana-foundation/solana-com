import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/tokens/get-all-token-accounts/all-web3v3", () => {
  it("lists all token accounts owned by an address", async () => {
    await runExample(() => import("./all-web3v3"), {
      output: new URL("./all-web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
