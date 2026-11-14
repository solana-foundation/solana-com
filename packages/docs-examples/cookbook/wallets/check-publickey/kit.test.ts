import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/wallets/check-publickey/kit", () => {
  it("checks whether an address lies on the ed25519 curve", async () => {
    await runExample(() => import("./kit"), {
      output: new URL("./kit.output.txt", import.meta.url),
      signatures: "none",
    });
  });
});
