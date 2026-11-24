import { describe, it, expect } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/development/subscribing-events/kit", () => {
  it("subscribes, airdrops, prints the account notification, then aborts", async () => {
    const { text } = await runExample(() => import("./kit"), {
      signatures: "none",
    });
    expect(text).toContain("lamports: 1000000000n");
  });
});
