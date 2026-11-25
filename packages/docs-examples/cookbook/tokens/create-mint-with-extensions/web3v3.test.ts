import { describe, it, expect } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/tokens/create-mint-with-extensions/web3v3", () => {
  it("creates a Token-2022 mint with metadata, pausable, permanent delegate, and default account state extensions", async () => {
    const { calls } = await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
    expect(calls).toContainEqual(["Decimals:", 6]);
    expect(calls).toContainEqual([
      "Extensions:",
      "MetadataPointer, PausableConfig, PermanentDelegate, DefaultAccountState, TokenMetadata",
    ]);
  });
});
