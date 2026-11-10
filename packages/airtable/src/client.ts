import { mkdir } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
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

/**
 * One conservative queue for all bases on this host, including separate Next.js
 * build workers and apps. /tmp is writable in deploy builds and Node functions.
 * Separate deploy hosts still need 429 backoff; this is not a distributed lock.
 * Only timestamps are persisted, never tokens, URLs, or Airtable records.
 */
export function createAirtableClient({
  directory = join(tmpdir(), "solana-com-airtable-v2"),
  now = Date.now,
  sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  random = Math.random,
} = {}) {
  async function updateState<T>(update: (state: State) => T): Promise<T> {
    await mkdir(directory, { recursive: true });
    // SQLite owns the inter-process lock and releases it if a worker dies. Never
    // delete a lock based on its age: another worker may already have replaced it.
    const database = new DatabaseSync(join(directory, "pacing.sqlite"), {
      timeout: 10_000,
    });
    try {
      database.exec(`
        CREATE TABLE IF NOT EXISTS pacing (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          nextRequestAt INTEGER NOT NULL,
          cooldownUntil INTEGER NOT NULL
        );
        BEGIN IMMEDIATE;
        INSERT OR IGNORE INTO pacing VALUES (1, 0, 0);
      `);
      const state = database
        .prepare("SELECT nextRequestAt, cooldownUntil FROM pacing WHERE id = 1")
        .get() as State;
      const result = update(state);
      database
        .prepare(
          "UPDATE pacing SET nextRequestAt = ?, cooldownUntil = ? WHERE id = 1",
        )
        .run(state.nextRequestAt, state.cooldownUntil);
      database.exec("COMMIT");
      return result;
    } finally {
      // Closing rolls back an incomplete transaction, including on errors.
      database.close();
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
