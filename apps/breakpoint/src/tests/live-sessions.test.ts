import { describe, expect, it } from "vitest";
import type { AgendaItem } from "@/content/agenda/types";
import {
  calculateLiveSchedule,
  dayKeyForDate,
  formatInstantInZone,
  formatMinutes,
  londonNow,
  parseEventInstant,
  parseClock,
  parseDurationMinutes,
  sessionsForStage,
  stagesInSchedule,
  viewerTimeZoneDifference,
  zonedTimeToUtc,
} from "@/lib/live-sessions";

function session(
  overrides: Partial<AgendaItem> & Pick<AgendaItem, "id" | "time">,
): AgendaItem {
  return {
    day: "Day 1",
    location: "Main Stage",
    sortOrder: 0,
    speakers: [],
    title: overrides.id,
    ...overrides,
  };
}

// Monday 16 November 2026 is Day 1; London is on GMT, so UTC == local.
const DAY_ONE = (time: string) => Date.parse(`2026-11-16T${time}:00Z`);

describe("londonNow", () => {
  it("returns the London calendar date and minutes since midnight", () => {
    const { date, minutes } = londonNow(DAY_ONE("09:30"));
    expect(date).toBe("2026-11-16");
    expect(minutes).toBe(9 * 60 + 30);
  });

  it("keeps the London date when UTC has already rolled over", () => {
    // 23:30 London in July is 22:30 UTC on the same day.
    const { date } = londonNow(Date.parse("2026-07-10T22:30:00Z"));
    expect(date).toBe("2026-07-10");
  });
});

describe("parsers", () => {
  it("parses HH:mm clocks and rejects anything else", () => {
    expect(parseClock("09:05")).toBe(545);
    expect(parseClock("9:05")).toBe(545);
    expect(parseClock("TBC")).toBeUndefined();
    expect(parseClock("25:00")).toBeUndefined();
    expect(parseClock(undefined)).toBeUndefined();
  });

  it("reads the agenda's duration formats", () => {
    expect(parseDurationMinutes("15 min.")).toBe(15);
    expect(parseDurationMinutes("1hr")).toBe(60);
    expect(parseDurationMinutes("1hr 30m")).toBe(90);
    expect(parseDurationMinutes("2 hours")).toBe(120);
    expect(parseDurationMinutes("90")).toBe(90);
    expect(parseDurationMinutes("1:30")).toBe(90);
    expect(parseDurationMinutes("all day")).toBeUndefined();
  });

  it("maps conference dates to agenda day tabs", () => {
    expect(dayKeyForDate("2026-11-15")).toBe("Pre-Event");
    expect(dayKeyForDate("2026-11-16")).toBe("Day 1");
    expect(dayKeyForDate("2026-11-17")).toBe("Day 2");
    expect(dayKeyForDate("2026-11-18")).toBeNull();
  });

  it("formats minutes as a 24-hour clock", () => {
    expect(formatMinutes(545)).toBe("09:05");
    expect(formatMinutes(9 * 60 + 29.9)).toBe("09:29");
  });
});

describe("calculateLiveSchedule", () => {
  const agenda = [
    session({ id: "opening", time: "09:00", duration: "30 min." }),
    session({ id: "keynote", time: "09:30", duration: "45 min." }),
    session({ id: "panel", time: "10:15", duration: "1hr" }),
    session({
      id: "exchange",
      time: "09:30",
      duration: "30 min.",
      location: "Royal Exchange",
    }),
    session({ id: "tomorrow", time: "09:00", day: "Day 2" }),
    session({ id: "untimed", time: "TBC" }),
  ];

  it("flags the running session, the next one and the rest of the day", () => {
    const schedule = calculateLiveSchedule(agenda, DAY_ONE("09:40"));

    expect(schedule.day).toBe("Day 1");
    expect(schedule.sessions.map((s) => [s.id, s.status])).toEqual([
      ["opening", "ended"],
      ["keynote", "live"],
      ["exchange", "live"],
      ["panel", "next"],
    ]);
    expect(schedule.current?.id).toBe("keynote");
    expect(schedule.next?.id).toBe("panel");
  });

  it("reports the time to the next boundary", () => {
    const schedule = calculateLiveSchedule(agenda, DAY_ONE("09:40"));
    // Royal Exchange ends at 10:00, twenty minutes away.
    expect(schedule.boundaryInMs).toBe(20 * 60_000);
  });

  it("marks the first upcoming session on each stage as next", () => {
    const schedule = calculateLiveSchedule(agenda, DAY_ONE("08:00"));
    expect(schedule.current).toBeNull();
    expect(schedule.next?.id).toBe("opening");
    expect(schedule.sessions.map((s) => [s.id, s.status])).toEqual([
      ["opening", "next"],
      ["keynote", "later"],
      ["exchange", "next"],
      ["panel", "later"],
    ]);
  });

  it("shows unlocated sessions under every stage with one next per tab", () => {
    const schedule = calculateLiveSchedule(
      [...agenda, session({ id: "lunch", time: "12:00", location: undefined })],
      DAY_ONE("09:40"),
    );
    expect(
      sessionsForStage(schedule.sessions, "Main Stage").map((s) => [
        s.id,
        s.status,
      ]),
    ).toEqual([
      ["opening", "ended"],
      ["keynote", "live"],
      ["panel", "next"],
      ["lunch", "later"],
    ]);
    expect(
      sessionsForStage(schedule.sessions, "Royal Exchange").map((s) => [
        s.id,
        s.status,
      ]),
    ).toEqual([
      ["exchange", "live"],
      ["lunch", "next"],
    ]);
  });

  it("has nothing left to refresh once the day is over", () => {
    const schedule = calculateLiveSchedule(agenda, DAY_ONE("18:00"));
    expect(schedule.sessions.every((s) => s.status === "ended")).toBe(true);
    expect(schedule.boundaryInMs).toBeNull();
  });

  it("returns an empty day outside the conference dates", () => {
    const schedule = calculateLiveSchedule(
      agenda,
      Date.parse("2026-11-04T10:00:00Z"),
    );
    expect(schedule.day).toBeNull();
    expect(schedule.sessions).toEqual([]);
    expect(schedule.boundaryInMs).toBeNull();
  });

  it("assumes half an hour when a session has no duration", () => {
    const schedule = calculateLiveSchedule(
      [session({ id: "open-ended", time: "09:00" })],
      DAY_ONE("09:20"),
    );
    expect(schedule.current?.id).toBe("open-ended");
    expect(schedule.current?.endMinutes).toBe(9 * 60 + 30);
  });

  it("lists stages with the main stage first", () => {
    const schedule = calculateLiveSchedule(agenda, DAY_ONE("09:40"));
    expect(stagesInSchedule(schedule.sessions)).toEqual([
      "Main Stage",
      "Royal Exchange",
    ]);
  });
});

describe("zonedTimeToUtc", () => {
  it("treats London in November as UTC", () => {
    expect(zonedTimeToUtc("2026-11-16", 9 * 60, "Europe/London")).toBe(
      DAY_ONE("09:00"),
    );
  });

  it("applies summer time when London is on BST", () => {
    expect(zonedTimeToUtc("2026-07-10", 9 * 60, "Europe/London")).toBe(
      Date.parse("2026-07-10T08:00:00Z"),
    );
  });

  it("converts other zones", () => {
    expect(zonedTimeToUtc("2026-11-16", 9 * 60, "America/New_York")).toBe(
      Date.parse("2026-11-16T14:00:00Z"),
    );
  });
});

describe("viewerTimeZoneDifference", () => {
  it("is null for the event zone", () => {
    expect(viewerTimeZoneDifference("Europe/London", DAY_ONE("09:00"))).toBe(
      null,
    );
    expect(viewerTimeZoneDifference(null, DAY_ONE("09:00"))).toBeNull();
  });

  it("measures the viewer's offset from London", () => {
    expect(
      viewerTimeZoneDifference("America/New_York", DAY_ONE("09:00")),
    ).toEqual({ differenceMinutes: -300, place: "New York" });
    expect(viewerTimeZoneDifference("Asia/Tokyo", DAY_ONE("09:00"))).toEqual({
      differenceMinutes: 540,
      place: "Tokyo",
    });
  });

  it("is null for a zone the runtime does not know", () => {
    expect(viewerTimeZoneDifference("Mars/Olympus", DAY_ONE("09:00"))).toBe(
      null,
    );
  });
});

describe("formatInstantInZone", () => {
  it("formats a 24-hour clock in the given zone", () => {
    expect(formatInstantInZone(DAY_ONE("09:05"), "America/New_York")).toBe(
      "04:05",
    );
    expect(formatInstantInZone(DAY_ONE("00:30"), "Europe/London")).toBe(
      "00:30",
    );
  });
});

describe("parseEventInstant", () => {
  it("reads a value without a zone as London time", () => {
    expect(parseEventInstant("2026-11-16T10:05")).toBe(DAY_ONE("10:05"));
    // British Summer Time: 10:05 in London is 09:05 UTC.
    expect(parseEventInstant("2026-07-10T10:05:30")).toBe(
      Date.parse("2026-07-10T09:05:30Z"),
    );
    expect(parseEventInstant("2026-11-16")).toBe(DAY_ONE("00:00"));
  });

  it("keeps an explicit zone", () => {
    expect(parseEventInstant("2026-11-16T10:05:00Z")).toBe(DAY_ONE("10:05"));
    expect(parseEventInstant("2026-11-16T05:05:00-05:00")).toBe(
      DAY_ONE("10:05"),
    );
  });

  it("is null for something that is not a date", () => {
    expect(parseEventInstant("tomorrow")).toBeNull();
    expect(parseEventInstant("2026-11-16T25:00")).toBeNull();
  });
});
