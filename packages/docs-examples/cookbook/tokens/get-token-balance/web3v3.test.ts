import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/tokens/get-token-balance/web3v3", () => {
  it("reads a token account balance via Connection", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
