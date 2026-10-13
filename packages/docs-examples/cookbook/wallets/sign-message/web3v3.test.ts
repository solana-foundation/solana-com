import { describe, it, expect, vi } from "vitest";

describe("cookbook/wallets/sign-message/web3v3", () => {
  it("signs and verifies a message via Keypair methods", async () => {
    const logSpy = vi.spyOn(console, "log");
    try {
      await import("./web3v3");
      expect(logSpy).toHaveBeenCalledWith("Verified:", true);
    } finally {
      logSpy.mockRestore();
    }
  });
});
