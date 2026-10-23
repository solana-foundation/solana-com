import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchCalendarEvents,
  isUpcomingEvent,
  type CalendarEvent,
} from "@/lib/events/fetchCalendarEvents";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("events calendar", () => {
  it("excludes expired events, including events returned as future by Luma", () => {
    const event = {
      schedule: {
        from: "2026-10-20T10:00:00Z",
        to: "2026-10-20T11:00:00Z",
      },
    } as CalendarEvent;
    const now = Date.parse("2026-10-23T00:00:00Z");

    expect(isUpcomingEvent(event, now)).toBe(false);
    expect(isUpcomingEvent(event, Date.parse("2026-10-20T11:00:00Z"))).toBe(
      false,
    );
    expect(
      isUpcomingEvent(
        {
          ...event,
          schedule: { ...event.schedule, to: "2026-10-24T11:00:00Z" },
        },
        now,
      ),
    ).toBe(true);
  });

  it("loads every page from a Luma calendar", async () => {
    vi.stubEnv("LUMA_PRIVATE_API_KEY", "test-key");
    const makeEntry = (id: string) => ({
      event: {
        api_id: id,
        name: id,
        url: id,
        start_at: "2026-11-15T10:00:00Z",
        end_at: "2026-11-15T11:00:00Z",
        timezone: "Europe/London",
        geo_address_info: null,
        cover_url: null,
        event_type: "event",
      },
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            entries: [makeEntry("first")],
            has_more: true,
            next_cursor: "page-two",
          }),
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ entries: [makeEntry("second")], has_more: false }),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const events = await fetchCalendarEvents(
      "cal-test",
      { period: "future" },
      { fetchAllPages: true },
    );

    expect(events.map((event) => event.title)).toEqual(["first", "second"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toContain(
      "pagination_cursor=page-two",
    );
  });
});
