import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

export type AirtableFetchOptions = Pick<RequestInit, "cache"> & {
  next?: { revalidate?: number; tags?: string[] };
};

const MIN_INTERVAL_MS = 300;
const RATE_LIMIT_WAIT_MS = 30_000;
const MAX_ATTEMPTS = 3;

type State = { nextRequestAt: number; cooldownUntil: number };

function isMissing(error: unknown) {
  return (error as NodeJS.ErrnoException).code === "ENOENT";
}

/**
 * One conservative queue for all bases on this host, including separate Next.js
 * build workers and apps. /tmp is writable in deploy builds and Node functions.
 * Separate deploy hosts still need 429 backoff; this is not a distributed lock.
 * Only timestamps are persisted, never tokens, URLs, or Airtable records.
 */
export function createAirtableClient({
  directory = join(tmpdir(), "solana-com-airtable-v1"),
  now = Date.now,
  sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  random = Math.random,
} = {}) {
  const lockPath = join(directory, "lock");
  const statePath = join(directory, "state.json");

  async function updateState<T>(update: (state: State) => T): Promise<T> {
    await mkdir(directory, { recursive: true });
    const deadline = now() + 65_000;
    while (true) {
      try {
        await mkdir(lockPath);
        break;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        try {
          // Recover a worker that died during the short timestamp-only update.
          if (now() - (await stat(lockPath)).mtimeMs > 60_000) {
            await rm(lockPath, { recursive: true, force: true });
            continue;
          }
        } catch (error) {
          if (!isMissing(error)) throw error;
          continue;
        }
        if (now() >= deadline)
          throw new Error("Airtable pacing lock timed out");
        await sleep(25 + Math.floor(random() * 25));
      }
    }

    try {
      let state: State = { nextRequestAt: 0, cooldownUntil: 0 };
      try {
        state = JSON.parse(await readFile(statePath, "utf8")) as State;
      } catch (error) {
        if (!isMissing(error)) throw error;
      }
      const result = update(state);
      // Rename avoids leaving a partial state file if a worker exits mid-write.
      const temporaryPath = join(directory, "state.tmp");
      await writeFile(temporaryPath, JSON.stringify(state));
      await rename(temporaryPath, statePath);
      return result;
    } finally {
      await rm(lockPath, { recursive: true, force: true });
    }
  }

  async function waitForSlot() {
    while (true) {
      const delay = await updateState((state) => {
        const delay = Math.max(
          0,
          state.nextRequestAt - now(),
          state.cooldownUntil - now(),
        );
        if (delay === 0) state.nextRequestAt = now() + MIN_INTERVAL_MS;
        return delay;
      });
      if (delay === 0) return;
      // Re-read cooldown after waiting so an earlier 429 also stops queued calls.
      await sleep(delay);
    }
  }

  function retryDelay(response: Response, attempt: number) {
    let headerDelay = 0;
    const milliseconds = response.headers.get("retry-after-ms");
    const secondsOrDate = response.headers.get("retry-after");
    if (milliseconds !== null && Number.isFinite(Number(milliseconds))) {
      headerDelay = Number(milliseconds);
    }
    if (secondsOrDate !== null) {
      const seconds = Number(secondsOrDate);
      const delay = Number.isFinite(seconds)
        ? seconds * 1000
        : Date.parse(secondsOrDate) - now();
      if (Number.isFinite(delay)) headerDelay = Math.max(headerDelay, delay);
    }
    return (
      Math.max(RATE_LIMIT_WAIT_MS * 2 ** (attempt - 1), headerDelay) +
      Math.floor(random() * 1000)
    );
  }

  return async function fetchAirtableJson<T>(
    url: string,
    token: string,
    options: AirtableFetchOptions,
    context: string,
  ): Promise<T> {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      await waitForSlot();
      const response = await fetch(url, {
        ...options,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 429) {
        const delay = retryDelay(response, attempt);
        await updateState((state) => {
          state.cooldownUntil = Math.max(state.cooldownUntil, now() + delay);
        });
        await response.body?.cancel();
        if (attempt < MAX_ATTEMPTS) continue;
        throw new Error(
          `${context} failed (429) after ${MAX_ATTEMPTS} attempts`,
        );
      }
      if (!response.ok) {
        await response.body?.cancel();
        throw new Error(`${context} failed (${response.status})`);
      }
      return (await response.json()) as T;
    }
    throw new Error(`${context} failed after retry`);
  };
}

export const fetchAirtableJson = createAirtableClient();
