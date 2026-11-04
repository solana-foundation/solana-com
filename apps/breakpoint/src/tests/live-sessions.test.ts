import { describe, expect, it } from "vitest";
import type { AgendaItem } from "@/content/agenda/types";
import {
  calculateLiveSchedule,
  dayKeyForDate,
  formatMinutes,
  londonNow,
  parseClock,
  parseDurationMinutes,
  stagesInSchedule,
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
