import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/tokens/get-token-mint/web3v3", () => {
  it("fetches a Token-2022 mint", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
