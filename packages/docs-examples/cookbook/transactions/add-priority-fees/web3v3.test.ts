import { describe, it } from "vitest";
import { runExample } from "../../../test/record";

describe("cookbook/transactions/add-priority-fees/web3v3", () => {
  it("sets compute limits and priority fee, transfers SOL", async () => {
    await runExample(() => import("./web3v3"), {
      output: new URL("./web3v3.output.txt", import.meta.url),
    });
  });
});
