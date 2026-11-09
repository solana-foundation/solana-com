import "server-only";

export const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

export type AirtableFetchOptions = Pick<RequestInit, "cache"> & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

const AIRTABLE_MIN_REQUEST_INTERVAL_MS = 250;
const AIRTABLE_RATE_LIMIT_RETRY_MS = 30_000;
const AIRTABLE_MAX_ATTEMPTS = 2;

let requestQueue: Promise<void> = Promise.resolve();
let lastRequestStartedAt = 0;
let airtableCooldownUntil = 0;

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function waitForAirtableSlot() {
  const scheduled = requestQueue.then(async () => {
    while (true) {
      const now = Date.now();
      const spacingDelay =
        AIRTABLE_MIN_REQUEST_INTERVAL_MS - (now - lastRequestStartedAt);
      const cooldownDelay = airtableCooldownUntil - now;
      const delay = Math.max(0, spacingDelay, cooldownDelay);

      if (delay <= 0) break;
      await wait(delay);
    }

    lastRequestStartedAt = Date.now();
  });

  requestQueue = scheduled.catch(() => undefined);
  await scheduled;
}

function getRetryDelay(response: Response) {
  const retryAfterMsHeader = response.headers.get("retry-after-ms");
  if (retryAfterMsHeader) {
    const retryAfterMs = Number(retryAfterMsHeader);
    if (Number.isFinite(retryAfterMs) && retryAfterMs >= 0) {
      return retryAfterMs;
    }
  }

  const retryAfterHeader = response.headers.get("retry-after");
  if (retryAfterHeader) {
    const retryAfterSeconds = Number(retryAfterHeader);
    if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
      return retryAfterSeconds * 1000;
    }

    const retryAfterDate = Date.parse(retryAfterHeader);
    if (Number.isFinite(retryAfterDate)) {
      return Math.max(0, retryAfterDate - Date.now());
    }
  }

  return AIRTABLE_RATE_LIMIT_RETRY_MS;
}

export async function fetchAirtableJson<T>(
  url: string,
  token: string,
  options: AirtableFetchOptions,
  context: string,
): Promise<T> {
  for (let attempt = 1; attempt <= AIRTABLE_MAX_ATTEMPTS; attempt += 1) {
    await waitForAirtableSlot();

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 429) {
      const retryDelay = getRetryDelay(response);
      airtableCooldownUntil = Math.max(
        airtableCooldownUntil,
        Date.now() + retryDelay,
      );

      if (attempt === AIRTABLE_MAX_ATTEMPTS) break;

      await wait(retryDelay);
      continue;
    }

    if (!response.ok) {
      throw new Error(`${context} failed (${response.status})`);
    }

    return (await response.json()) as T;
  }

  throw new Error(`${context} failed after retry`);
}
