import { describe, it, expect } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/mev-protection/kit", () => {
  it("builds and signs a dontfront tx + tip without sending it to Jito", async () => {
    expect(process.env.SEND_TO_JITO).toBeUndefined();
    const { text } = await runExample(() => import("./kit"), {
      signatures: "none",
    });
    expect(text).toMatch(/^Signed transaction \(base64\): [A-Za-z0-9+/]+=*$/m);
    expect(text).not.toContain("Sent with dontfront protection");
  });
});
