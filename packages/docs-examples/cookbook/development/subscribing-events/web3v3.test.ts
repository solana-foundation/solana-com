import { describe, it, expect } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/development/subscribing-events/web3v3", () => {
  it("subscribes, airdrops, prints the account notification, then unsubscribes", async () => {
    const { text } = await runExample(() => import("./web3v3"), {
      signatures: "none",
    });
    expect(text).toMatch(/^AccountInfo: \{/m);
    expect(text).toContain("lamports: 1000000000");
  });
});
