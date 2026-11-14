import { describe, it, expect } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/development/subscribing-events/legacy", () => {
  it("subscribes, airdrops, prints the account notification, then unsubscribes", async () => {
    const { text } = await runExample(() => import("./legacy"), {
      signatures: "none",
    });
    expect(text).toMatch(/^AccountInfo: \{/m);
    expect(text).toContain("lamports: 1000000000");
  });
});
