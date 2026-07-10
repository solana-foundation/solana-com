import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findFirstTransaction: vi.fn(),
  unstableCache: vi.fn((callback: () => Promise<unknown>) => callback),
}));

vi.mock("next/cache", () => ({
  unstable_cache: mocks.unstableCache,
}));

vi.mock("@/lib/epoch1000/solana", () => ({
  findFirstTransaction: mocks.findFirstTransaction,
}));

import {
  getCachedFirstTransaction,
  getHotFirstTransaction,
  resetEpoch1000WalletLookupCacheForTests,
  WALLET_LOOKUP_CACHE_REVALIDATE_SECONDS,
} from "@/lib/epoch1000/wallet-cache";

const firstTx = {
  signature: "sig",
  slot: 123,
  blockTime: 1_700_000_000,
  capped: false,
  scanned: 20,
};

describe("epoch1000 wallet lookup cache", () => {
  beforeEach(() => {
    resetEpoch1000WalletLookupCacheForTests();
    mocks.findFirstTransaction.mockReset();
    mocks.unstableCache.mockClear();
    mocks.unstableCache.mockImplementation(
      (callback: () => Promise<unknown>) => callback,
    );
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1_000));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps successful lookups hot for the revalidate window", async () => {
    mocks.findFirstTransaction.mockResolvedValue(firstTx);

    await expect(getCachedFirstTransaction("wallet")).resolves.toEqual(firstTx);
    await expect(getHotFirstTransaction("wallet")).resolves.toEqual(firstTx);
    await expect(getCachedFirstTransaction("wallet")).resolves.toEqual(firstTx);

    expect(mocks.findFirstTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.unstableCache).toHaveBeenCalledTimes(1);
  });

  it("refreshes after the revalidate window expires", async () => {
    mocks.findFirstTransaction
      .mockResolvedValueOnce(firstTx)
      .mockResolvedValueOnce({ ...firstTx, signature: "new-sig" });

    await expect(getCachedFirstTransaction("wallet")).resolves.toEqual(firstTx);
    vi.setSystemTime(
      new Date(WALLET_LOOKUP_CACHE_REVALIDATE_SECONDS * 1000 + 1_001),
    );

    await expect(getCachedFirstTransaction("wallet")).resolves.toMatchObject({
      signature: "new-sig",
    });
    expect(mocks.findFirstTransaction).toHaveBeenCalledTimes(2);
  });

  it("dedupes concurrent cache misses for the same wallet", async () => {
    let resolveLookup: (_value: typeof firstTx) => void = () => {};
    mocks.findFirstTransaction.mockReturnValue(
      new Promise((resolve) => {
        resolveLookup = resolve;
      }),
    );

    const first = getCachedFirstTransaction("wallet");
    const second = getCachedFirstTransaction("wallet");

    expect(first).toBe(second);
    expect(mocks.findFirstTransaction).toHaveBeenCalledTimes(1);

    resolveLookup(firstTx);
    await expect(first).resolves.toEqual(firstTx);
    await expect(second).resolves.toEqual(firstTx);
  });
});
