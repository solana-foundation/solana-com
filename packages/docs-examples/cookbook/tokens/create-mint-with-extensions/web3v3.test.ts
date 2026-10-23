import { describe, it, expect, vi } from "vitest";

describe("cookbook/tokens/create-mint-with-extensions/web3v3", () => {
  it("creates a Token-2022 mint with metadata, pausable, permanent delegate, and default account state extensions", async () => {
    const logSpy = vi.spyOn(console, "log");
    try {
      await import("./web3v3");
      expect(logSpy).toHaveBeenCalledWith("Decimals:", 6);
      expect(logSpy).toHaveBeenCalledWith(
        "Extensions:",
        "MetadataPointer, PausableConfig, PermanentDelegate, DefaultAccountState, TokenMetadata",
      );
    } finally {
      logSpy.mockRestore();
    }
  });
});
