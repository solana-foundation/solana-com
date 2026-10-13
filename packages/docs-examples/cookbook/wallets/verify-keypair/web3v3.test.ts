import { describe, it, expect, vi } from "vitest";

describe("cookbook/wallets/verify-keypair/web3v3", () => {
  it("checks the derived address against an expected one", async () => {
    const logSpy = vi.spyOn(console, "log");
    try {
      await import("./web3v3");
      expect(logSpy).toHaveBeenCalledWith(true);
    } finally {
      logSpy.mockRestore();
    }
  });
});
