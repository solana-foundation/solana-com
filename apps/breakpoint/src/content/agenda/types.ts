export type AgendaDay = {
  /** ISO calendar date in London time, e.g. "2026-11-16". */
  date: string;
  /** Tab label and the value stored on `AgendaItem.day`. */
  key: string;
};

/**
 * Breakpoint 2026 runs Monday 16 and Tuesday 17 November at Olympia London.
 * Sunday 15 November is registration and community side events. Airtable
 * rows carry a `Start Time`; these dates turn it into a day tab.
 */
export const AGENDA_DAYS: readonly AgendaDay[] = [
  { date: "2026-11-15", key: "Pre-Event" },
  { date: "2026-11-16", key: "Day 1" },
  { date: "2026-11-17", key: "Day 2" },
];

export const AGENDA_DAY_TABS = AGENDA_DAYS.map((day) => day.key);

export const MAIN_STAGE = "Main Stage";

/**
 * Which floor of the venue each stage is on, as a key into the
 * `pages.schedule.list.floors` messages so the label can be translated.
 */
export const STAGE_FLOORS: Record<string, "groundFloor" | "firstFloor"> = {
  [MAIN_STAGE]: "groundFloor",
  "Royal Exchange": "firstFloor",
};

/** Floor for a stage name as Airtable spells it, tolerant of case and a trailing "Stage". */
export function stageFloor(stage: string) {
  const normalized = stage.trim().toLowerCase();
  for (const [name, floor] of Object.entries(STAGE_FLOORS)) {
    const key = name.toLowerCase();
    if (normalized === key || normalized === `${key} stage`) return floor;
  }
  return undefined;
}

export type AgendaSpeaker = {
  company?: string;
  /** Airtable record id in the Onboarded Speakers table, when linked. */
  id?: string;
  isModerator?: boolean;
  name: string;
  title?: string;
  /** Public X profile, attached from the published speakers list. */
  xUrl?: string;
};

export type AgendaItem = {
  /** Asset classes the session is filed under, e.g. "Money" or "Tokenized Equities". */
  assetClasses?: string[];
  day: string;
  description?: string;
  duration?: string;
  /** Session format shown in the expanded card, e.g. "Keynote" or "Fireside". */
  format?: string;
  id: string;
  /** Stage name, e.g. "Main Stage" or "Royal Exchange". */
  location?: string;
  sortOrder: number;
  speakerIds?: string[];
  speakers: AgendaSpeaker[];
  tag?: string;
  time: string;
  title: string;
  /** Royal Exchange track, e.g. "Payments" or "Consumer"; Main Stage sessions have none. */
  track?: string;
  variant?: "session" | "static";
};
