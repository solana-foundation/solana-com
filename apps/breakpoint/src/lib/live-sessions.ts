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
/** Refresh this long before a session boundary so the switch feels instant. */
const REFRESH_LEAD_MS = 5_000;

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
  /** Milliseconds until the schedule should be recalculated, if anything changes later. */
  refreshInMs: number | null;
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
 * out because they cannot be placed on the clock.
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

  let nextAssigned = false;
  const sessions: LiveSession[] = timed.map((session) => {
    let status: SessionStatus;
    if (minutes >= session.endMinutes) {
      status = "ended";
    } else if (minutes >= session.startMinutes) {
      status = "live";
    } else if (!nextAssigned) {
      status = "next";
      nextAssigned = true;
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
    refreshInMs:
      boundary === null
        ? null
        : Math.max(
            0,
            Math.round((boundary - minutes) * 60_000) - REFRESH_LEAD_MS,
          ),
  };
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
