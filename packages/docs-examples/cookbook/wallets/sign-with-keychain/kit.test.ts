import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/wallets/sign-with-keychain/kit", () => {
  it("signs and sends a transfer with a Keychain memory signer", async () => {
    await expectExampleLogsSignature(() => import("./kit"));
  });
});
