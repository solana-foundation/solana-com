import type { AgendaItem } from "@/content/agenda/types";

export const EVENT_TIME_ZONE = "Europe/London";

/**
 * Calendar dates for each agenda day tab. Mirrors the agenda's day mapping
 * (16 and 17 November are the conference days, 15 November is registration
 * and side events) so "today" resolves to the same tab the agenda shows.
 */
export const LIVE_AGENDA_DAYS: ReadonlyArray<{ date: string; key: string }> = [
  { date: "2026-11-15", key: "Pre-Event" },
  { date: "2026-11-16", key: "Day 1" },
  { date: "2026-11-17", key: "Day 2" },
];

/** Session length assumed when Airtable gives neither a duration nor an end. */
const DEFAULT_DURATION_MINUTES = 30;
/** Fetch fresh data this long before a session boundary so the switch feels instant. */
export const REFRESH_LEAD_MS = 5_000;

export type SessionStatus = "live" | "next" | "later" | "ended";

export type LiveSession = AgendaItem & {
  endMinutes: number;
  startMinutes: number;
  status: SessionStatus;
};

export type LiveSchedule = {
  /** Agenda day tab for today, or null outside the conference dates. */
  day: string | null;
  /** London calendar date, ISO `YYYY-MM-DD`. */
  date: string;
  sessions: LiveSession[];
  current: LiveSession | null;
  next: LiveSession | null;
  /** Milliseconds until the next session starts or ends, if anything changes later. */
  boundaryInMs: number | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
});

const clockFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  second: "2-digit",
  timeZone: EVENT_TIME_ZONE,
});

/** London calendar date and minutes since midnight (with seconds as a fraction). */
export function londonNow(now: number) {
  const date = dateFormatter.format(now);
  const parts = clockFormatter.formatToParts(now);
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");
  // en-GB can format midnight as "24"; keep it inside the day.
  const hour = read("hour") % 24;
  return {
    date,
    minutes: hour * 60 + read("minute") + read("second") / 60,
  };
}

export function parseClock(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return undefined;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return undefined;
  return hours * 60 + minutes;
}

/** Reads "15 min.", "1hr", "1hr 30m", "90" or "1:30" as minutes. */
export function parseDurationMinutes(
  value: string | undefined,
): number | undefined {
  if (!value) return undefined;
  const text = value.trim().toLowerCase();
  if (!text) return undefined;

  if (/^\d+$/.test(text)) return Number(text);

  const clock = text.match(/^(\d{1,2}):(\d{2})$/);
  if (clock) return Number(clock[1]) * 60 + Number(clock[2]);

  let total = 0;
  let matched = false;
  const hours = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/);
  if (hours) {
    total += Number(hours[1]) * 60;
    matched = true;
  }
  const minutes = text.match(/(\d+)\s*(?:minutes?|mins?|m)\b/);
  if (minutes) {
    total += Number(minutes[1]);
    matched = true;
  }

  return matched ? Math.round(total) : undefined;
}

export function dayKeyForDate(date: string): string | null {
  return LIVE_AGENDA_DAYS.find((day) => day.date === date)?.key ?? null;
}

/**
 * Today's sessions with live / next / later / ended flags, in start order.
 * `items` is the full agenda; sessions without a usable start time are left
 * out because they cannot be placed on the clock. "Next" is assigned per
 * stage, because the page shows one stage at a time; `next` is the earliest
 * upcoming session across all stages.
 */
export function calculateLiveSchedule(
  items: AgendaItem[],
  now: number,
): LiveSchedule {
  const { date, minutes } = londonNow(now);
  const day = dayKeyForDate(date);

  const timed: Array<Omit<LiveSession, "status">> = [];
  if (day) {
    for (const item of items) {
      if (item.day !== day) continue;
      const startMinutes = parseClock(item.time);
      if (startMinutes === undefined) continue;
      const duration =
        parseDurationMinutes(item.duration) ?? DEFAULT_DURATION_MINUTES;
      timed.push({
        ...item,
        startMinutes,
        endMinutes: startMinutes + Math.max(duration, 1),
      });
    }
  }

  timed.sort((a, b) => {
    if (a.startMinutes !== b.startMinutes)
      return a.startMinutes - b.startMinutes;
    return a.sortOrder - b.sortOrder;
  });

  const stagesWithNext = new Set<string>();
  const sessions: LiveSession[] = timed.map((session) => {
    const stage = session.location ?? "";
    let status: SessionStatus;
    if (minutes >= session.endMinutes) {
      status = "ended";
    } else if (minutes >= session.startMinutes) {
      status = "live";
    } else if (!stagesWithNext.has(stage)) {
      status = "next";
      stagesWithNext.add(stage);
    } else {
      status = "later";
    }
    return { ...session, status };
  });

  const current = sessions.find((session) => session.status === "live") ?? null;
  const next = sessions.find((session) => session.status === "next") ?? null;

  // The schedule changes at the next start or end boundary after now.
  let boundary: number | null = null;
  for (const session of sessions) {
    for (const candidate of [session.startMinutes, session.endMinutes]) {
      if (candidate > minutes && (boundary === null || candidate < boundary)) {
        boundary = candidate;
      }
    }
  }

  return {
    day,
    date,
    sessions,
    current,
    next,
    boundaryInMs:
      boundary === null
        ? null
        : Math.max(0, Math.round((boundary - minutes) * 60_000)),
  };
}

/**
 * Sessions shown under one stage tab: that stage's own sessions plus any
 * without a location (shared breaks, unassigned slots), as the full agenda
 * does. The first upcoming session in the list is the tab's "next".
 */
export function sessionsForStage(
  sessions: LiveSession[],
  stage: string,
): LiveSession[] {
  let nextAssigned = false;
  return sessions
    .filter((session) => !session.location || session.location === stage)
    .map((session) => {
      if (session.status !== "next" && session.status !== "later") {
        return session;
      }
      const status: SessionStatus = nextAssigned ? "later" : "next";
      nextAssigned = true;
      return session.status === status ? session : { ...session, status };
    });
}

/** Stage names present in a schedule, with the main stage first. */
export function stagesInSchedule(
  sessions: LiveSession[],
  mainStage = "Main Stage",
): string[] {
  const stages = new Set<string>();
  for (const session of sessions) {
    if (session.location) stages.add(session.location);
  }
  return [...stages].sort((a, b) => {
    if (a === mainStage) return -1;
    if (b === mainStage) return 1;
    return a.localeCompare(b);
  });
}

export function formatMinutes(minutes: number): string {
  const whole = Math.floor(minutes) % (24 * 60);
  const hours = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

/**
 * Wall-clock minutes since midnight in `timeZone` for an instant, together
 * with the zone's offset from UTC in minutes at that instant.
 */
function wallClock(instant: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(instant);
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");
  const wall = Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    read("hour") % 24,
    read("minute"),
  );
  // Compare whole minutes so sub-minute parts of `instant` do not leak in.
  const utcMinute = Math.floor(instant / 60_000) * 60_000;
  return { offsetMinutes: Math.round((wall - utcMinute) / 60_000) };
}

/** Offset of `timeZone` from UTC, in minutes, at `instant`. */
export function timeZoneOffsetMinutes(timeZone: string, instant: number) {
  return wallClock(instant, timeZone).offsetMinutes;
}

/**
 * The UTC instant for a wall-clock time (`date` as ISO `YYYY-MM-DD`,
 * `minutes` since midnight) in `timeZone`.
 */
export function zonedTimeToUtc(
  date: string,
  minutes: number,
  timeZone: string,
): number {
  const [year, month, day] = date.split("-").map(Number);
  const guess =
    Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1) +
    Math.round(minutes * 60_000);
  // Shift by the zone's offset, then correct once in case the guess landed
  // on the other side of a daylight-saving change.
  let instant = guess - timeZoneOffsetMinutes(timeZone, guess) * 60_000;
  instant = guess - timeZoneOffsetMinutes(timeZone, instant) * 60_000;
  return instant;
}

/** UTC instant of a session clock time on the schedule's London date. */
export function sessionInstant(date: string, minutes: number): number {
  return zonedTimeToUtc(date, minutes, EVENT_TIME_ZONE);
}

/**
 * How a viewer's time zone relates to the event's at `instant`. Returns
 * `null` for the event zone itself (or an unknown zone), so the page shows
 * nothing extra to people in London.
 */
export function viewerTimeZoneDifference(
  viewerTimeZone: string | null | undefined,
  instant: number,
): { differenceMinutes: number; place: string } | null {
  if (!viewerTimeZone || viewerTimeZone === EVENT_TIME_ZONE) return null;
  let differenceMinutes: number;
  try {
    differenceMinutes =
      timeZoneOffsetMinutes(viewerTimeZone, instant) -
      timeZoneOffsetMinutes(EVENT_TIME_ZONE, instant);
  } catch {
    return null;
  }
  return { differenceMinutes, place: timeZonePlace(viewerTimeZone) };
}

/** "America/Argentina/Buenos_Aires" → "Buenos Aires"; "UTC" stays as is. */
export function timeZonePlace(timeZone: string): string {
  const segment = timeZone.split("/").pop() ?? timeZone;
  return segment.replace(/_/g, " ");
}

/** "HH:mm" in `timeZone`, 24-hour like the London times beside it. */
export function formatInstantInZone(
  instant: number,
  timeZone: string,
  locale = "en-GB",
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    timeZone,
  }).format(instant);
}

/** Short zone name such as "EST" or "GMT+1" for `instant` in `timeZone`. */
export function formatZoneName(
  instant: number,
  timeZone: string,
  locale = "en-GB",
): string {
  const part = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeZoneName: "short",
  })
    .formatToParts(instant)
    .find((candidate) => candidate.type === "timeZoneName");
  return part?.value ?? "";
}
