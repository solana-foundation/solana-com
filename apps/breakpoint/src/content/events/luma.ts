import { unstable_cache } from "next/cache";
import {
  BREAKPOINT_LUMA_CALENDAR_ID,
  BREAKPOINT_LUMA_EVENT_ID,
} from "@/content/links";
import type { HighlightedEvent } from "./types";

const LUMA_API_BASE = "https://api.lu.ma";
const LUMA_REQUEST_TIMEOUT_MS = 10_000;
const EVENTS_CACHE_SECONDS = 1800;
const EVENTS_CACHE_TAG = "breakpoint-events";
const LUMA_PAGE_SIZE = 50;
const LUMA_MAX_PAGES = 20;

interface LumaEventData {
  api_id?: string;
  name?: string;
  url?: string;
  start_at?: string;
  end_at?: string;
  timezone?: string;
  cover_url?: string;
  geo_address_info?: {
    city?: string;
  };
}

interface LumaCalendarItemsResponse {
  entries?: { event?: LumaEventData }[];
  has_more?: boolean;
  next_cursor?: string | null;
}

function lumaHeaders(): HeadersInit {
  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.LUMA_PRIVATE_API_KEY) {
    headers["x-luma-api-key"] = process.env.LUMA_PRIVATE_API_KEY;
  }
  return headers;
}

async function fetchLumaJson(url: URL): Promise<unknown | null> {
  try {
    const response = await fetch(url, {
      headers: lumaHeaders(),
      signal: AbortSignal.timeout(LUMA_REQUEST_TIMEOUT_MS),
      next: {
        revalidate: EVENTS_CACHE_SECONDS,
        tags: [EVENTS_CACHE_TAG],
      },
    });

    if (!response.ok) {
      console.warn(`Luma request failed (${response.status}): ${url.pathname}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`Luma request errored: ${url.pathname}`, error);
    return null;
  }
}

function normalizeLumaEvent(event: LumaEventData): HighlightedEvent | null {
  if (!event.api_id || !event.name || !event.start_at || !event.url) {
    return null;
  }

  return {
    id: event.api_id,
    title: event.name,
    url: `https://luma.com/${event.url}`,
    coverUrl: event.cover_url ?? null,
    startAt: event.start_at,
    endAt: event.end_at ?? null,
    timezone: event.timezone ?? null,
    city: event.geo_address_info?.city ?? null,
  };
}

async function fetchCalendarEvents(): Promise<HighlightedEvent[]> {
  const events: HighlightedEvent[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | null = null;

  for (let page = 0; page < LUMA_MAX_PAGES; page += 1) {
    const url = new URL(`${LUMA_API_BASE}/calendar/get-items`);
    url.searchParams.set("calendar_api_id", BREAKPOINT_LUMA_CALENDAR_ID);
    url.searchParams.set("series_mode", "sessions");
    url.searchParams.set("period", "future");
    url.searchParams.set("pagination_limit", String(LUMA_PAGE_SIZE));
    if (cursor) {
      url.searchParams.set("pagination_cursor", cursor);
    }

    const payload = (await fetchLumaJson(
      url,
    )) as LumaCalendarItemsResponse | null;

    events.push(
      ...(payload?.entries ?? [])
        .map((entry) => (entry.event ? normalizeLumaEvent(entry.event) : null))
        .filter((event): event is HighlightedEvent => event !== null),
    );

    const nextCursor = payload?.next_cursor ?? null;
    if (!payload?.has_more || !nextCursor) {
      return events;
    }

    if (seenCursors.has(nextCursor)) {
      console.warn("Luma pagination returned a repeated cursor.");
      return events;
    }

    seenCursors.add(nextCursor);
    cursor = nextCursor;
  }

  console.warn(`Luma pagination exceeded ${LUMA_MAX_PAGES} pages.`);
  return events;
}

async function fetchHighlightedEvents(): Promise<HighlightedEvent[]> {
  const now = Date.now();
  const events = new Map<string, HighlightedEvent>();

  for (const event of await fetchCalendarEvents()) {
    if (!event || event.id === BREAKPOINT_LUMA_EVENT_ID) continue;
    const endsAt = Date.parse(event.endAt ?? event.startAt);
    if (Number.isFinite(endsAt) && endsAt < now) continue;
    events.set(event.id, event);
  }

  return [...events.values()].sort(
    (a, b) => Date.parse(a.startAt) - Date.parse(b.startAt),
  );
}

export const getHighlightedEvents =
  process.env.NODE_ENV === "production"
    ? unstable_cache(fetchHighlightedEvents, ["breakpoint-events-luma"], {
        revalidate: EVENTS_CACHE_SECONDS,
        tags: [EVENTS_CACHE_TAG],
      })
    : fetchHighlightedEvents;
