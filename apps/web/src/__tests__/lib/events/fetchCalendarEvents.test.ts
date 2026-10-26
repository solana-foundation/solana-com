import { afterEach, describe, expect, it, vi } from "vitest";
const cacheStore = vi.hoisted(() => new Map<string, Promise<unknown>>());
vi.mock("next/cache", () => ({
  unstable_cache:
    (fn: (...args: unknown[]) => Promise<unknown>) =>
    (...args: unknown[]) => {
      const key = JSON.stringify(args);
      let result = cacheStore.get(key);
      if (!result) {
        result = fn(...args).catch((error: unknown) => {
          cacheStore.delete(key);
          throw error;
        });
        cacheStore.set(key, result);
      }
      return result;
    },
}));
import {
  CALENDAR_EVENTS_REVALIDATE_SECONDS,
  fetchCalendarEvents,
  isUpcomingEvent,
  parseIcalEvents,
  type CalendarEvent,
} from "@/lib/events/fetchCalendarEvents";

const feed = `BEGIN:VCALENDAR
BEGIN:VEVENT
DTSTART:20201020T100000Z
DTEND:20201020T110000Z
UID:evt-old@events.lu.ma
SUMMARY:Past event
DESCRIPTION:Get up-to-date information at: https://luma.com/past-event
END:VEVENT
BEGIN:VEVENT
DTSTART:20991115T100000Z
DTEND:20991115T110000Z
UID:evt-future@events.lu.ma
SUMMARY:Solana\\, meetup
DESCRIPTION:Get up-to-date information at: https://luma.com/solana-meet
 up
LOCATION:London\\, United Kingdom
END:VEVENT
END:VCALENDAR`;

afterEach(() => {
  vi.unstubAllGlobals();
  cacheStore.clear();
});

describe("events calendar", () => {
  it("excludes an event as soon as its end time passes", () => {
    const event = {
      schedule: {
        from: "2026-10-20T10:00:00Z",
        to: "2026-10-20T11:00:00Z",
      },
    } as CalendarEvent;
    expect(isUpcomingEvent(event, Date.parse("2026-10-20T11:00:00Z"))).toBe(
      false,
    );
  });

  it("parses published iCal events, including folded and escaped text", () => {
    const events = parseIcalEvents(feed);
    expect(events).toHaveLength(2);
    expect(events[1]).toMatchObject({
      title: "Solana, meetup",
      rsvp: "https://luma.com/solana-meetup",
      schedule: {
        from: "2099-11-15T10:00:00Z",
        to: "2099-11-15T11:00:00Z",
      },
      venue: { address: "London, United Kingdom" },
    });
  });

  it("shows the last day of a multi-day event", () => {
    const events = parseIcalEvents(`BEGIN:VEVENT
DTSTART;VALUE=DATE:20991101
DTEND;VALUE=DATE:20991113
UID:evt-multi@events.lu.ma
SUMMARY:Hacker House
DESCRIPTION:https://luma.com/hacker-house
END:VEVENT`);
    expect(events[0].schedule.to).toBe("2099-11-12T23:59:59.999Z");
  });

  it("uses the documented public subscription", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(feed));
    vi.stubGlobal("fetch", fetchMock);

    const events = await fetchCalendarEvents("cal-test", { period: "future" });

    expect(events.map((event) => event.title)).toEqual(["Solana, meetup"]);
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      "https://api.lu.ma/ics/get?entity=calendar&id=cal-test",
    );
    expect(fetchMock.mock.calls[0][1].cache).toBe("no-store");
  });

  it("keeps past events available for the archive", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(feed))
      .mockResolvedValueOnce(new Response("<html></html>"));
    vi.stubGlobal("fetch", fetchMock);
    expect(
      (await fetchCalendarEvents("cal-test", { period: "past" })).map(
        (event) => event.title,
      ),
    ).toEqual(["Past event"]);
    expect(fetchMock.mock.calls[0][1].cache).toBe("no-store");
    expect(fetchMock.mock.calls[1][1].next).toEqual({
      revalidate: CALENDAR_EVENTS_REVALIDATE_SECONDS,
    });
  });

  it("loads past events from the alternate iCal host when the first is rate limited", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
      .mockResolvedValueOnce(new Response(feed))
      .mockResolvedValueOnce(new Response("<html></html>"));
    vi.stubGlobal("fetch", fetchMock);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      expect(
        (await fetchCalendarEvents("cal-test", { period: "past" })).map(
          (event) => event.title,
        ),
      ).toEqual(["Past event"]);
      expect(String(fetchMock.mock.calls[1][0])).toBe(
        "https://api.luma.com/ics/get?entity=calendar&id=cal-test",
      );
    } finally {
      warn.mockRestore();
    }
  });

  it("reuses one calendar feed for past and future listings", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(feed))
      .mockResolvedValue(new Response("<html></html>"));
    vi.stubGlobal("fetch", fetchMock);

    await fetchCalendarEvents("cal-test", { period: "future" });
    await fetchCalendarEvents("cal-test", { period: "past" });

    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).includes("/ics/get")),
    ).toHaveLength(1);
  });

  it("retries a calendar after both live sources fail", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
      .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockResolvedValueOnce(new Response(feed))
      .mockResolvedValueOnce(new Response("<html></html>"));
    vi.stubGlobal("fetch", fetchMock);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      expect(
        await fetchCalendarEvents("cal-test", { period: "future" }),
      ).toEqual([]);
      expect(
        (await fetchCalendarEvents("cal-test", { period: "future" })).map(
          (event) => event.title,
        ),
      ).toEqual(["Solana, meetup"]);
      expect(
        fetchMock.mock.calls.filter(([url]) =>
          String(url).includes("/ics/get"),
        ),
      ).toHaveLength(3);
    } finally {
      warn.mockRestore();
    }
  });

  it.each([false, true])(
    "loads upcoming events from a public calendar page (wrapped: %s)",
    async (wrapped) => {
      const calendarData = {
        calendar: { api_id: "cal-test" },
        upcoming: {
          entries: [
            {
              event: {
                name: "Solana Meetup",
                url: "solana-meetup",
                start_at: "2099-11-15T10:00:00Z",
                end_at: "2099-11-15T11:00:00Z",
                timezone: "Europe/London",
                cover_url: "https://images.lumacdn.com/cover.png",
                geo_address_info: { city: "London", country: "UK" },
              },
            },
          ],
        },
      };
      const pageData = {
        props: {
          pageProps: {
            initialData: wrapped
              ? { kind: "calendar", data: calendarData }
              : calendarData,
          },
        },
      };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(
          new Response("Too many requests", { status: 429 }),
        )
        .mockResolvedValueOnce(
          new Response("Too many requests", { status: 429 }),
        )
        .mockResolvedValueOnce(
          new Response(
            `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(pageData)}</script>`,
          ),
        );
      vi.stubGlobal("fetch", fetchMock);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      try {
        const events = await fetchCalendarEvents("cal-test", {
          period: "future",
        });
        expect(events).toMatchObject([
          {
            title: "Solana Meetup",
            rsvp: "https://luma.com/solana-meetup",
            img: { primary: "https://images.lumacdn.com/cover.png" },
            venue: { city: "London" },
          },
        ]);
        expect(fetchMock.mock.calls[2][0]).toBe(
          "https://luma.com/calendar/cal-test",
        );
      } finally {
        warn.mockRestore();
      }
    },
  );

  it("uses public event metadata for local dates and cover images", async () => {
    const metadata = {
      "@type": "Event",
      "@id": "https://luma.com/solana-meetup",
      startDate: "2099-11-15T18:00:00-04:00",
      endDate: "2099-11-15T19:00:00-04:00",
      image: ["https://images.lumacdn.com/cover.png"],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(feed))
      .mockResolvedValueOnce(
        new Response(
          `<script type="application/ld+json">${JSON.stringify(metadata)}</script>`,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const [event] = await fetchCalendarEvents("cal-test", {
      period: "future",
    });
    expect(event).toMatchObject({
      schedule: {
        from: "2099-11-15T18:00:00-04:00",
        timezone: "-04:00",
      },
      img: { primary: "https://images.lumacdn.com/cover.png" },
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not fetch an unsupported event group as a calendar", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(
      await fetchCalendarEvents("evgrp-test", { period: "future" }),
    ).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
