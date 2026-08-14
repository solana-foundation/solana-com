import { unstable_cache } from "next/cache";
import { findFirstTransaction, type FirstTx } from "./solana";

export const WALLET_LOOKUP_CACHE_REVALIDATE_SECONDS = 60;

const CACHE_KEY_VERSION = "epoch1000-wallet-first-tx-v1";
const CACHE_TAG = "epoch1000-wallet-lookup";
const LOCAL_CACHE_MAX_ENTRIES = 1_000;

type LocalCacheEntry =
  | {
      status: "pending";
      expiresAt: number;
      promise: Promise<FirstTx | null>;
    }
  | {
      status: "settled";
      expiresAt: number;
      value: FirstTx | null;
    };

const localCache = new Map<string, LocalCacheEntry>();

export function getHotFirstTransaction(
  wallet: string,
  now = Date.now(),
): Promise<FirstTx | null> | null {
  const entry = localCache.get(wallet);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= now) {
    localCache.delete(wallet);
    return null;
  }

  if (entry.status === "pending") {
    return entry.promise;
  }

  return Promise.resolve(entry.value);
}

export function getCachedFirstTransaction(
  wallet: string,
  now = Date.now(),
): Promise<FirstTx | null> {
  const hot = getHotFirstTransaction(wallet, now);
  if (hot) {
    return hot;
  }

  const expiresAt = now + WALLET_LOOKUP_CACHE_REVALIDATE_SECONDS * 1000;
  const promise = unstable_cache(
    () => findFirstTransaction(wallet),
    [CACHE_KEY_VERSION, wallet],
    {
      revalidate: WALLET_LOOKUP_CACHE_REVALIDATE_SECONDS,
      tags: [CACHE_TAG],
    },
  )()
    .then((value) => {
      localCache.set(wallet, {
        status: "settled",
        expiresAt: Date.now() + WALLET_LOOKUP_CACHE_REVALIDATE_SECONDS * 1000,
        value,
      });
      pruneLocalCache();
      return value;
    })
    .catch((err) => {
      const entry = localCache.get(wallet);
      if (entry?.status === "pending" && entry.promise === promise) {
        localCache.delete(wallet);
      }

      throw err;
    });

  localCache.set(wallet, { status: "pending", expiresAt, promise });
  pruneLocalCache(now);

  return promise;
}

export function resetEpoch1000WalletLookupCacheForTests() {
  localCache.clear();
}

function pruneLocalCache(now = Date.now()) {
  if (localCache.size <= LOCAL_CACHE_MAX_ENTRIES) return;

  for (const [wallet, entry] of localCache) {
    if (entry.expiresAt <= now) {
      localCache.delete(wallet);
    }
  }

  while (localCache.size > LOCAL_CACHE_MAX_ENTRIES) {
    const oldest = localCache.keys().next().value;
    if (!oldest) break;
    localCache.delete(oldest);
  }
}
