import { unstable_cache } from "next/cache";
import {
  findValidatorFirstTransaction,
  type ValidatorLookup,
} from "./vote-account";

export const VALIDATOR_LOOKUP_CACHE_REVALIDATE_SECONDS = 60;

const CACHE_KEY_VERSION = "epoch1000-validator-first-tx-v2";
const CACHE_TAG = "epoch1000-validator-lookup";
const LOCAL_CACHE_MAX_ENTRIES = 1_000;

type LocalCacheEntry =
  | {
      status: "pending";
      expiresAt: number;
      promise: Promise<ValidatorLookup | null>;
    }
  | {
      status: "settled";
      expiresAt: number;
      value: ValidatorLookup | null;
    };

const localCache = new Map<string, LocalCacheEntry>();

export function getHotValidatorFirstTransaction(
  voteAccount: string,
  now = Date.now(),
): Promise<ValidatorLookup | null> | null {
  const entry = localCache.get(voteAccount);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= now) {
    localCache.delete(voteAccount);
    return null;
  }

  if (entry.status === "pending") {
    return entry.promise;
  }

  return Promise.resolve(entry.value);
}

export function getCachedValidatorFirstTransaction(
  voteAccount: string,
  now = Date.now(),
): Promise<ValidatorLookup | null> {
  const hot = getHotValidatorFirstTransaction(voteAccount, now);
  if (hot) {
    return hot;
  }

  const expiresAt = now + VALIDATOR_LOOKUP_CACHE_REVALIDATE_SECONDS * 1000;
  const promise = unstable_cache(
    () => findValidatorFirstTransaction(voteAccount),
    [CACHE_KEY_VERSION, voteAccount],
    {
      revalidate: VALIDATOR_LOOKUP_CACHE_REVALIDATE_SECONDS,
      tags: [CACHE_TAG],
    },
  )()
    .then((value) => {
      localCache.set(voteAccount, {
        status: "settled",
        expiresAt:
          Date.now() + VALIDATOR_LOOKUP_CACHE_REVALIDATE_SECONDS * 1000,
        value,
      });
      pruneLocalCache();
      return value;
    })
    .catch((err) => {
      const entry = localCache.get(voteAccount);
      if (entry?.status === "pending" && entry.promise === promise) {
        localCache.delete(voteAccount);
      }

      throw err;
    });

  localCache.set(voteAccount, { status: "pending", expiresAt, promise });
  pruneLocalCache(now);

  return promise;
}

export function resetEpoch1000ValidatorLookupCacheForTests() {
  localCache.clear();
}

function pruneLocalCache(now = Date.now()) {
  if (localCache.size <= LOCAL_CACHE_MAX_ENTRIES) return;

  for (const [voteAccount, entry] of localCache) {
    if (entry.expiresAt <= now) {
      localCache.delete(voteAccount);
    }
  }

  while (localCache.size > LOCAL_CACHE_MAX_ENTRIES) {
    const oldest = localCache.keys().next().value;
    if (!oldest) break;
    localCache.delete(oldest);
  }
}
