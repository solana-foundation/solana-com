import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/add-memo/web3v3", () => {
  it("sends a memo transaction and logs a valid signature", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
  });
});
