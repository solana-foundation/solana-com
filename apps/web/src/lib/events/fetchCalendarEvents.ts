import slugify from "@sindresorhus/slugify";
import { isExternalLink } from "../utils/isExternalLink";
import breakpointImg from "@@/assets/events/breakpoint.jpg";
import shipordieImg from "@@/assets/events/shipordie.jpg";

export type LumaEvent = {
  event: {
    api_id: string;
    name: string;
    url: string;
    start_at: string;
    end_at: string;
    timezone: string;
    geo_address_info: {
      city: string | null;
      region: string | null;
      city_state: string | null;
      country: string | null;
      address: string | null;
    };
    cover_url: string | null;
    event_type: string;
  };
  platform?: string;
};

export type CalendarEvent = {
  key: string;
  title: string;
  description: string;
  platform?: string;
  rsvp: string;
  lumaUrl?: string;
  /** When true, this event is shown as the featured event on the events page */
  featured?: boolean;
  schedule: {
    from: string | null;
    to: string | null;
    timezone: string;
  };
  img: {
    primary: string | null;
    alt: string | null;
  };
  venue: {
    city: string | null;
    region: string | null;
    city_state: string | null;
    country: string | null;
    address: string | null;
  };
  type?: string;
};

type FetchCalendarEventsRequestOptions = {
  revalidate?: number;
  fetchAllPages?: boolean;
};

const LUMA_PAGE_SIZE = 50;
const LUMA_MAX_PAGES = 20;

export function isUpcomingEvent(
  event: CalendarEvent,
  now = Date.now(),
): boolean {
  const endTime = event.schedule.to || event.schedule.from;
  if (!endTime) return false;
  const endTimestamp = Date.parse(endTime);
  return Number.isFinite(endTimestamp) && endTimestamp > now;
}

/** Static signup form events (e.g. link-in-bio) shown on the events calendar */
const signupFormEvents: CalendarEvent[] = [];

function toCalendarEvent(el: LumaEvent): CalendarEvent {
  const {
    name,
    api_id,
    url,
    start_at,
    end_at,
    timezone,
    geo_address_info,
    cover_url,
    event_type,
  } = el.event;
  const slug =
    event_type === "session"
      ? `${slugify(name, { separator: "" })}?id=${api_id}`
      : url.toLowerCase();

  return {
    key: slug,
    title: name,
    description: name,
    platform: el.platform,
    rsvp: isExternalLink(url) ? url : `https://lu.ma/${url}`,
    schedule: { from: start_at ?? null, to: end_at ?? null, timezone },
    img: { primary: cover_url || null, alt: name || null },
    venue: {
      city: geo_address_info?.city || null,
      region: geo_address_info?.region || null,
      city_state: geo_address_info?.city_state || null,
      country: geo_address_info?.country || null,
      address: geo_address_info?.address || null,
    },
  };
}

// Public calendar pages include their upcoming events in Next's initial data.
// This keeps the listing usable when Luma rate limits its private endpoint.
async function fetchPublicCalendarEvents(
  calendarId: string,
  revalidate?: number,
): Promise<CalendarEvent[]> {
  if (!calendarId.startsWith("cal-")) return [];

  try {
    const response = await fetch(`https://luma.com/calendar/${calendarId}`, {
      signal: AbortSignal.timeout(10000),
      next: revalidate === undefined ? undefined : { revalidate },
    });
    if (!response.ok) return [];
    const html = await response.text();
    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    );
    if (!match) return [];
    const page = JSON.parse(match[1]) as {
      props?: {
        pageProps?: {
          initialData?: {
            data?: {
              calendar?: { api_id?: string };
              upcoming?: { entries?: LumaEvent[] };
            };
            calendar?: { api_id?: string };
            upcoming?: { entries?: LumaEvent[] };
          };
        };
      };
    };
    const initialData = page.props?.pageProps?.initialData;
    const data = initialData?.data ?? initialData;
    if (data?.calendar?.api_id !== calendarId) return [];
    return (data.upcoming?.entries ?? []).map(toCalendarEvent);
  } catch (error) {
    console.warn("Luma public calendar request failed:", error);
    return [];
  }
}

/**
 *
 * @param {string} calendarId The calendar ID to fetch events from.
 * @param {object} options Options for the query.
 * @returns {Promise<Array>} An array of events.
 */
export async function fetchCalendarEvents(
  calendarId: string,
  options: Record<string, string | number>,
  requestOptions: FetchCalendarEventsRequestOptions = {},
): Promise<CalendarEvent[]> {
  if (!process.env.LUMA_PRIVATE_API_KEY) {
    console.warn("LUMA_PRIVATE_API_KEY is not set. Using public calendar.");
    return fetchPublicCalendarEvents(calendarId, requestOptions.revalidate);
  }

  let allEvents: CalendarEvent[] = [];

  const seenCursors = new Set<string>();
  let cursor: string | null = null;
  let apiFailed = false;

  for (let page = 0; page < LUMA_MAX_PAGES; page += 1) {
    const url = new URL("https://api.lu.ma/calendar/get-items");
    url.search = new URLSearchParams({
      calendar_api_id: calendarId,
      series_mode: "sessions",
      pagination_limit: LUMA_PAGE_SIZE.toString(),
      ...options,
      ...(cursor ? { pagination_cursor: cursor } : {}),
    }).toString();

    let data: {
      entries?: LumaEvent[];
      has_more?: boolean;
      next_cursor?: string | null;
    };
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-luma-api-key": process.env.LUMA_PRIVATE_API_KEY,
        },
        signal: AbortSignal.timeout(10000),
        next:
          requestOptions.revalidate === undefined
            ? undefined
            : { revalidate: requestOptions.revalidate },
      });
      if (!res.ok) {
        console.warn(`LUMA API returned status ${res.status}`);
        apiFailed = true;
        break;
      }
      data = await res.json();
    } catch (error: unknown) {
      console.warn("LUMA API request failed:", error);
      apiFailed = true;
      break;
    }

    allEvents.push(...(data.entries ?? []).map(toCalendarEvent));

    if (!requestOptions.fetchAllPages || !data.has_more || !data.next_cursor) {
      break;
    }
    if (seenCursors.has(data.next_cursor)) {
      console.warn("LUMA API returned a repeated pagination cursor.");
      break;
    }
    seenCursors.add(data.next_cursor);
    cursor = data.next_cursor;
  }

  if (apiFailed && allEvents.length === 0) {
    allEvents = await fetchPublicCalendarEvents(
      calendarId,
      requestOptions.revalidate,
    );
  }

  // Append static signup form events before overrides so they can be customized here too
  allEvents = allEvents.concat(signupFormEvents);

  // Add custom img and timezone overrides
  allEvents.forEach((el) => {
    if (el.key === "https://solana.com/breakpoint") {
      el.img.primary = breakpointImg.src;
      el.schedule.timezone = "Asia/Dubai";
      el.schedule.to = "2025-12-13T23:59:59+04:00";
    } else if (el.key === "https://solana.com/accelerate/ship-or-die") {
      el.img.primary = shipordieImg.src;
      el.schedule.timezone = "America/New_York";
      el.schedule.to = "2025-05-23T23:59:59-04:00";
    } else if (
      el.key === "accelerate-miami" ||
      el.rsvp === "https://lu.ma/accelerate-miami" ||
      el.rsvp === "https://luma.com/accelerate-miami"
    ) {
      el.featured = true;
    }
    return el;
  });

  const subevents = ["https://lu.ma/Mega-mixer-2025"];

  // Filter out subevents from being featured
  allEvents = allEvents.filter((event) => !subevents.includes(event.rsvp));

  return allEvents;
}
