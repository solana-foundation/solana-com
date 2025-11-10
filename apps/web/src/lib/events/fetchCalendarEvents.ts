import slugify from "@sindresorhus/slugify";

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
  platform: string;
};

export type CalendarEvent = {
  key: string;
  title: string;
  description: string;
  platform: string;
  rsvp: string;
  schedule: {
    from: Date;
    to: Date;
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
      from: new Date("2024-06-01T10:00:00Z"),
      to: new Date("2024-06-03T10:00:00Z"),
      timezone: "UTC",
    },
    img: {
      primary: require("../../../assets/events/solana-event.jpg"),
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

/**
 *
 * @param {string} calendarId The calendar ID to fetch events from.
 * @param {object} options Options for the query.
 * @returns {Promise<Array>} An array of events.
 */
export async function fetchCalendarEvents(calendarId, options) {
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

  const res = await fetch(getCalendarEventsUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-luma-api-key": process.env.LUMA_PRIVATE_API_KEY,
    },
  });

  const { entries } = await res.json();

  if (!entries) {
    return allEvents;
  }

  allEvents = allEvents.concat(
    entries.map((el: LumaEvent) => {
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
      const startDate = new Date(start_at);
      const endDate = new Date(end_at);
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
        rsvp: `https://lu.ma/${url}`,
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

  return allEvents;
}

/**
 *
 * @param {object} options Options for the query.
 * @returns {Promise<Array>} An array of events.
 */
export async function fetchCalendarRiverEvents(options) {
  if (!process.env.RIVER_KEY) {
    console.warn("RIVER_KEY is not set. Returning dummy data.");
    return dummyEvent;
  }

  let allEvents = [];
  const getCalendarEventsUrl = new URL(
    "https://app.getriver.io/api/v1alpha1/community/solana/list-events",
  );

  getCalendarEventsUrl.search = new URLSearchParams(options).toString();

  const res = await fetch(getCalendarEventsUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      "RIVER-ACCESS-KEY": process.env.RIVER_KEY,
    },
  });

  const { events } = await res.json();

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
          const startDate = new Date(startTime);
          const endDate = new Date(endTime);
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
            },
          };
        })
      : [],
  );

  return allEvents;
}
