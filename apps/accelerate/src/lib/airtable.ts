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

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function waitForAirtableSlot() {
  const scheduled = requestQueue.then(async () => {
    const elapsed = Date.now() - lastRequestStartedAt;
    const delay = Math.max(0, AIRTABLE_MIN_REQUEST_INTERVAL_MS - elapsed);
    if (delay > 0) await wait(delay);
    lastRequestStartedAt = Date.now();
  });

  requestQueue = scheduled.catch(() => undefined);
  await scheduled;
}

function getRetryDelay(response: Response) {
  const retryAfter = Number(response.headers.get("retry-after"));
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
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

    if (response.status === 429 && attempt < AIRTABLE_MAX_ATTEMPTS) {
      await wait(getRetryDelay(response));
      continue;
    }

    if (!response.ok) {
      throw new Error(`${context} failed (${response.status})`);
    }

    return (await response.json()) as T;
  }

  throw new Error(`${context} failed after retry`);
}
