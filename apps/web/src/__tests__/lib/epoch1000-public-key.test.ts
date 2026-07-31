import { describe, expect, it } from "vitest";
import { isValidSolanaAddress } from "@/lib/epoch1000/public-key";

describe("epoch1000 Solana public key validation", () => {
  it("accepts base58 values that decode to 32 bytes", () => {
    expect(isValidSolanaAddress("11111111111111111111111111111111")).toBe(true);
    expect(
      isValidSolanaAddress("So11111111111111111111111111111111111111112"),
    ).toBe(true);
    expect(
      isValidSolanaAddress("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    ).toBe(true);
  });

  it("rejects short, oversized, and non-base58 values", () => {
    expect(isValidSolanaAddress("a")).toBe(false);
    expect(isValidSolanaAddress("")).toBe(false);
    expect(
      isValidSolanaAddress(
        "5HueCGU8rMjxEXxiPuD5BDuRa5Ww7C12QQAQH9Wzj3JDPZQQwXP",
      ),
    ).toBe(false);
    expect(
      isValidSolanaAddress("So11111111111111111111111111111111111111110"),
    ).toBe(false);
  });

  it("trims whitespace before validating", () => {
    expect(isValidSolanaAddress("  11111111111111111111111111111111  ")).toBe(
      true,
    );
  });
});
