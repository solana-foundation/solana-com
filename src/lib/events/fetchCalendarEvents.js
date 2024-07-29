import slugify from "@sindresorhus/slugify";

/**
 *
 * @param {string} calendarId The calendar ID to fetch events from.
 * @param {object} options Options for the query.
 * @returns {Promise<Array>} An array of events.
 */
export default async function fetchCalendarEvents(calendarId, options) {
  if (!process.env.LUMA_PRIVATE_API_KEY) {
    console.warn("LUMA_PRIVATE_API_KEY is not set. Returning dummy data.");
    return [
      {
        key: "dummy-event",
        title: "Event example",
        description: "This is a dummy event description.",
        platform: "Zoom",
        rsvp: "https://lu.ma/rsvp",
        schedule: {
          from: new Date("2024-06-01T10:00:00Z"),
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
  }

  let allEvents = [];
  let hasMore = true;
  let nextCursor = null;

  while (hasMore) {
    const getCalendarEventsUrl = new URL(
      "https://api.lu.ma/calendar/get-items",
    );

    const query = {
      calendar_api_id: calendarId,
      series_mode: "sessions",
      ...options,
    };

    if (nextCursor) {
      query.pagination_cursor = nextCursor;
    }

    getCalendarEventsUrl.search = new URLSearchParams(query).toString();

    const res = await fetch(getCalendarEventsUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-luma-api-key": process.env.LUMA_PRIVATE_API_KEY,
      },
    });

    const { entries, has_more, next_cursor } = await res.json();

    allEvents = allEvents.concat(
      entries.map((el) => {
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
            primary: cover_url,
            alt: name,
          },
          venue: {
            city: geo_address_info?.city,
            region: geo_address_info?.region,
            city_state: geo_address_info?.city_state,
            country: geo_address_info?.country,
            address: geo_address_info?.address,
          },
        };
      }),
    );

    // Update the hasMore and nextCursor values for the next iteration
    hasMore = has_more;
    nextCursor = next_cursor;
  }

  return allEvents;
}
