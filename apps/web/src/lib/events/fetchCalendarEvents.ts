import breakpointImg from "@@/assets/events/breakpoint.jpg";
import shipordieImg from "@@/assets/events/shipordie.jpg";

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
};

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

function parseIcalDate(value: string): string | null {
  const match = value.match(
    /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z)?$/,
  );
  if (!match) return null;
  const [, year, month, day, hour = "00", minute = "00", second = "00"] = match;
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  return Number.isFinite(Date.parse(iso)) ? iso : null;
}

function unescapeIcalText(value: string): string {
  return value.replace(/\\([nN,;\\])/g, (_, escaped: string) =>
    escaped.toLowerCase() === "n" ? "\n" : escaped,
  );
}

export function parseIcalEvents(ical: string): CalendarEvent[] {
  // RFC 5545 folds long lines by adding a space or tab to the next line.
  const lines = ical.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const events: CalendarEvent[] = [];
  let fields: Record<string, string> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      fields = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (fields && fields.STATUS !== "CANCELLED") {
        const from = parseIcalDate(fields.DTSTART ?? "");
        const rawEnd = parseIcalDate(fields.DTEND ?? "");
        // RFC 5545 DTEND for all-day events is exclusive. Show the final day
        // while keeping the event visible until that day's midnight.
        const to =
          rawEnd && fields.DTEND_ALL_DAY
            ? new Date(Date.parse(rawEnd) - 1).toISOString()
            : rawEnd;
        const title = unescapeIcalText(fields.SUMMARY ?? "");
        const eventId = fields.UID?.split("@")[0];
        const description = unescapeIcalText(fields.DESCRIPTION ?? "");
        const url =
          fields.URL ||
          description.match(/https:\/\/luma\.com\/[^\s]+/)?.[0] ||
          (eventId ? `https://luma.com/event/${eventId}` : "");
        const location = unescapeIcalText(fields.LOCATION ?? "");

        if (from && to && title && url) {
          events.push({
            key: url.toLowerCase(),
            title,
            description: title,
            rsvp: url,
            schedule: { from, to, timezone: "UTC" },
            img: { primary: null, alt: title },
            venue: {
              city: null,
              region: null,
              city_state: null,
              country: null,
              address: location.startsWith("http") ? null : location || null,
            },
          });
        }
      }
      fields = null;
      continue;
    }
    if (!fields) continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const name = line.slice(0, colon).split(";")[0];
    fields[name] = line.slice(colon + 1);
    if (name === "DTEND" && line.slice(0, colon).includes("VALUE=DATE")) {
      fields.DTEND_ALL_DAY = "true";
    }
  }
  return events;
}

/** Fetch the calendar's published iCal subscription feed. */
export async function fetchCalendarEvents(
  calendarId: string,
  options: Record<string, string | number>,
  requestOptions: FetchCalendarEventsRequestOptions = {},
): Promise<CalendarEvent[]> {
  // iCal subscriptions are Luma's supported public interface for calendars.
  // The current Doppler key is for a legacy API and is rejected by the
  // documented, calendar-scoped JSON API.
  if (!calendarId.startsWith("cal-") || options.period === "past") return [];

  const url = new URL("https://api2.luma.com/ics/get");
  url.searchParams.set("entity", "calendar");
  url.searchParams.set("id", calendarId);
  let allEvents: CalendarEvent[] = [];
  try {
    const response = await fetch(url, {
      headers: { accept: "text/calendar" },
      signal: AbortSignal.timeout(10000),
      next:
        requestOptions.revalidate === undefined
          ? undefined
          : { revalidate: requestOptions.revalidate },
    });
    if (!response.ok) throw new Error(`Luma iCal returned ${response.status}`);
    allEvents = parseIcalEvents(await response.text()).filter((event) =>
      isUpcomingEvent(event),
    );
  } catch (error) {
    console.warn("Luma iCal request failed:", error);
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
