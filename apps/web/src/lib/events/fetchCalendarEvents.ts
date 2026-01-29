import slugify from "@sindresorhus/slugify";
import { isExternalLink } from "../utils/isExternalLink";
import breakpointImg from "@@/assets/events/breakpoint.jpg";
import shipordieImg from "@@/assets/events/shipordie.jpg";
import solanaEventImg from "@@/assets/events/solana-event.jpg";

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

export type RiverEvent = {
  id: string;
  name: string;
  description: string;
  link: string;
  startTime: string;
  endTime: string;
  timezone: string;
  city: string;
  country: string;
  image: string;
};

export type CalendarEvent = {
  key: string;
  title: string;
  description: string;
  platform?: string;
  rsvp: string;
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
};

const dummyEvent = [
  {
    key: "dummy-event",
    title: "Event example",
    description: "This is a dummy event description.",
    platform: "Zoom",
    rsvp: "https://solana.com",
    schedule: {
      from: "2024-06-01T10:00:00Z",
      to: "2024-06-03T10:00:00Z",
      timezone: "UTC",
    },
    img: {
      primary: solanaEventImg.src,
      alt: "Dummy Event",
    },
    venue: {
      city: "Dummy City",
      region: "Dummy Region",
      city_state: "Dummy City, Dummy Region",
      country: "Dummy Country",
      address: "123 Dummy St",
    },
  },
];

/** Static signup form events (e.g. link-in-bio) shown on the events calendar */
const signupFormEvents: CalendarEvent[] = [
  {
    key: "mtndao-signup",
    title: "MTN DAO",
    description: "Sign up for MTN DAO.",
    rsvp: "https://lnk.bio/mtndao",
    schedule: {
      from: "2026-02-01T00:00:00-07:00",
      to: "2026-02-28T23:59:59-07:00",
      timezone: "America/Denver",
    },
    img: {
      primary: "/images/events/mtndao-hero.webp",
      alt: "MTN DAO",
    },
    venue: {
      city: "Salt Lake City",
      region: "UT",
      city_state: "Salt Lake City, UT",
      country: "USA",
      address: null,
    },
  },
];

/**
 *
 * @param {string} calendarId The calendar ID to fetch events from.
 * @param {object} options Options for the query.
 * @returns {Promise<Array>} An array of events.
 */
export async function fetchCalendarEvents(
  calendarId: string,
  options: Record<string, any>,
): Promise<CalendarEvent[]> {
  if (!process.env.LUMA_PRIVATE_API_KEY) {
    console.warn("LUMA_PRIVATE_API_KEY is not set. Returning dummy data.");
    return dummyEvent;
  }

  let allEvents: CalendarEvent[] = [];

  const getCalendarEventsUrl = new URL("https://api.lu.ma/calendar/get-items");

  const query = {
    calendar_api_id: calendarId,
    series_mode: "sessions",
    ...options,
  };

  getCalendarEventsUrl.search = new URLSearchParams(query).toString();

  let res: Response;
  try {
    // Add timeout to prevent hanging during build
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    res = await fetch(getCalendarEventsUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-luma-api-key": process.env.LUMA_PRIVATE_API_KEY,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error: any) {
    // Handle network errors, timeouts, and other fetch failures
    if (error.name === "AbortError" || error.code === "ETIMEDOUT") {
      console.warn("LUMA API request timed out. Returning empty array.");
    } else {
      console.warn("LUMA API request failed:", error.message || error);
    }
    return [];
  }

  if (!res.ok) {
    console.warn(`LUMA API returned status ${res.status}`);
    return [];
  }

  let events: LumaEvent[] = [];

  try {
    const data = await res.json();
    events = data.entries;
  } catch (error) {
    console.warn("Failed to parse LUMA API response:", error);
    return [];
  }

  if (!events) {
    return allEvents;
  }

  allEvents = allEvents.concat(
    events.map((el) => {
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
      const startDate = start_at ?? null;
      const endDate = end_at ?? null;
      const platform = el.platform;

      const slug =
        event_type === "session"
          ? `${slugify(name, { separator: "" })}?id=${api_id}`
          : `${url.toLowerCase()}`;

      return {
        key: slug,
        title: name,
        description: name,
        platform: platform,
        rsvp: isExternalLink(url) ? url : `https://lu.ma/${url}`,
        schedule: {
          from: startDate,
          to: endDate,
          timezone,
        },
        img: {
          primary: cover_url || null,
          alt: name || null,
        },
        venue: {
          city: geo_address_info?.city || null,
          region: geo_address_info?.region || null,
          city_state: geo_address_info?.city_state || null,
          country: geo_address_info?.country || null,
          address: geo_address_info?.address || null,
        },
      };
    }),
  );

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
      el.schedule.to = "2025-04-26T23:59:59+07:00";
    }
    return el;
  });

  const subevents = ["https://lu.ma/Mega-mixer-2025"];

  // Filter out subevents from being featured
  allEvents = allEvents.filter((event) => !subevents.includes(event.rsvp));

  return allEvents;
}

/**
 *
 * @param {object} options Options for the query.
 * @returns {Promise<Array>} An array of events.
 */
export async function fetchCalendarRiverEvents(options: Record<string, any>) {
  if (!process.env.RIVER_KEY) {
    console.warn("RIVER_KEY is not set. Returning dummy data.");
    return dummyEvent;
  }

  let allEvents: CalendarEvent[] = [];

  const getCalendarEventsUrl = new URL(
    "https://app.getriver.io/api/v1alpha1/community/solana/list-events",
  );

  getCalendarEventsUrl.search = new URLSearchParams(options).toString();

  let res: Response;
  try {
    // Add timeout to prevent hanging during build
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    res = await fetch(getCalendarEventsUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        "RIVER-ACCESS-KEY": process.env.RIVER_KEY,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error: any) {
    // Handle network errors, timeouts, and other fetch failures
    if (error.name === "AbortError" || error.code === "ETIMEDOUT") {
      console.warn("River API request timed out. Returning empty array.");
    } else {
      console.warn("River API request failed:", error.message || error);
    }
    return [];
  }

  if (!res.ok) {
    console.warn(`River API returned status ${res.status}`);
    return [];
  }

  let events: RiverEvent[] = [];

  try {
    const data = await res.json();
    events = data.events;
  } catch (error) {
    console.warn("Failed to parse River API response:", error);
    return [];
  }

  allEvents = allEvents.concat(
    events && events.length
      ? events.map((el) => {
          const {
            id,
            name,
            description,
            link,
            startTime,
            endTime,
            timezone,
            city,
            country,
            image,
          } = el;
          const startDate = startTime;
          const endDate = endTime;
          const imageUrl = image;

          return {
            key: id,
            title: name,
            description: description,
            rsvp: link,
            schedule: {
              from: startDate,
              to: endDate,
              timezone,
            },
            img: {
              primary: imageUrl,
              alt: name,
            },
            venue: {
              city: city,
              country: country,
              address: null,
              region: null,
              city_state: null,
            },
          };
        })
      : [],
  );

  return allEvents;
}
