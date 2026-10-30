import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/accounts/create-account/web3v3", () => {
  it("runs end-to-end and logs a valid tx signature", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
  });
});
