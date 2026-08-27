import type { AgendaItem, AgendaSpeaker } from "@/content/agenda/types";
import {
  asNumber,
  asString,
  getAirtableRecords,
  getField,
  isPublished,
  type AirtableRecord,
} from "@/lib/airtable";

const LONDON_TIME_ZONE = "Europe/London";

function isLinkedRecordId(value: string) {
  return /^rec[a-z0-9]{14,}$/i.test(value);
}

function asDisplayString(value: unknown): string | undefined {
  const text = asString(value);
  if (!text) return undefined;

  const parts = text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !isLinkedRecordId(part));

  return parts.length > 0 ? parts.join(", ") : undefined;
}

function asStringList(
  value: unknown,
  splitCommas = false,
): string[] | undefined {
  if (Array.isArray(value)) {
    const values = value.flatMap(
      (item) => asStringList(item, splitCommas) ?? [],
    );
    return values.length > 0 ? values : undefined;
  }

  const text = asString(value);
  if (!text) return undefined;

  const delimiter = splitCommas ? /[\n;|,]+/ : /[\n;|]+/;
  const values = text
    .split(delimiter)
    .map((item) => item.trim())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
}

function formatDateTime(value: string): string | undefined {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: LONDON_TIME_ZONE,
  }).format(parsed);
}

function formatClockText(value: unknown): string | undefined {
  const text = asString(value);
  if (!text) return undefined;

  const isoTime = formatDateTime(text);
  if (isoTime) return isoTime;

  const match = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (!match) return text;

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? "0");
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function dateKey(value: string): string | undefined {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: LONDON_TIME_ZONE,
    year: "numeric",
  }).format(parsed);
}

function normalizeDayValue(value: unknown): string | undefined {
  const text = asString(value);
  if (!text) return undefined;

  const normalized = text.toLowerCase().trim();
  if (normalized.includes("pre")) return "Pre-Event";

  const dayMatch = normalized.match(/\bday\s*([123])\b/);
  if (dayMatch) return `Day ${dayMatch[1]}`;

  if (/^[123]$/.test(normalized)) return `Day ${normalized}`;

  const key = dateKey(text);
  if (key === "2026-11-14") return "Pre-Event";
  if (key === "2026-11-15") return "Day 1";
  if (key === "2026-11-16") return "Day 2";
  if (key === "2026-11-17") return "Day 3";

  return text;
}

function minutesFromClock(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return undefined;

  return Number(match[1]) * 60 + Number(match[2]);
}

function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min.`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours}hr` : `${hours}hr ${remainder}m`;
}

function asDuration(value: unknown): string | undefined {
  const numeric = asNumber(value);
  if (numeric !== undefined) return formatDurationMinutes(numeric);

  const text = asString(value);
  if (!text) return undefined;
  if (/^\d+$/.test(text)) return formatDurationMinutes(Number(text));

  return text;
}

function durationFromTimes(
  start: string | undefined,
  end: string | undefined,
): string | undefined {
  const startMinutes = minutesFromClock(start);
  const endMinutes = minutesFromClock(end);
  if (startMinutes === undefined || endMinutes === undefined) return undefined;

  const delta = endMinutes - startMinutes;
  if (delta <= 0) return undefined;

  return formatDurationMinutes(delta);
}

function fieldList(
  fields: Record<string, unknown>,
  names: string[],
  splitCommas = false,
) {
  return (
    getField(fields, names, (value) => asStringList(value, splitCommas)) ?? []
  );
}

function parseSpeakerText(
  value: string,
): Pick<AgendaSpeaker, "company" | "name"> {
  const cleanValue = value.replace(/^[^A-Za-z0-9]+/, "").trim();
  const parenMatch = cleanValue.match(/^(.+?)\s*\((.+)\)$/);
  if (parenMatch?.[1] && parenMatch[2]) {
    return {
      company: parenMatch[2].trim(),
      name: parenMatch[1].trim(),
    };
  }

  const dashParts = cleanValue.split(/\s+-\s+/);
  if (dashParts.length >= 2) {
    return {
      company: dashParts.slice(1).join(" - ").trim(),
      name: dashParts[0]?.trim() ?? cleanValue,
    };
  }

  return { name: cleanValue };
}

function buildSpeakers(fields: Record<string, unknown>): AgendaSpeaker[] {
  const names = fieldList(
    fields,
    [
      "Confirmed Speakers Full Name",
      "Confirmed Speakers Full Name (Formatted)",
      "Confirmed Speakers Full Name (Luma)",
      "Confirmed Speakers, Concise (Luma)",
      "Speakers and Moderators, Concise (Luma)",
      "Speakers and Moderators (Luma)",
      "Speaker Name and Company",
      "Speaker Names",
      "Speaker Name",
      "Presenters",
      "Presenter",
      "Panelists",
      "Panelist",
      "Speakers",
      "Speaker",
    ],
    true,
  ).filter((name) => !isLinkedRecordId(name));

  const companies = fieldList(fields, [
    "Speaker Companies",
    "Speaker Company",
    "Companies",
    "Company",
    "Organizations",
    "Organization",
    "Organisation",
  ]);

  const titles = fieldList(fields, [
    "Speaker Titles",
    "Speaker Title",
    "Speaker Roles",
    "Speaker Role",
    "Speaker Job Titles",
    "Speaker Job Title",
    "Role or Title (from Onboarded Speakers)",
    "Speaker Role Lookup",
    "Roles",
  ]);

  const speakers = names.map((name, index) => {
    const parsed = parseSpeakerText(name);

    return {
      company:
        parsed.company ??
        companies[index] ??
        (names.length === 1 ? companies[0] : undefined),
      name: parsed.name,
      title: titles[index],
    };
  });

  const moderatorNames = fieldList(
    fields,
    ["Moderator Names", "Moderator Name", "Moderator", "Moderators"],
    true,
  ).filter((name) => !isLinkedRecordId(name));

  const moderatorCompanies = fieldList(fields, [
    "Moderator Companies",
    "Moderator Company",
  ]);

  const moderatorTitles = fieldList(fields, [
    "Moderator Titles",
    "Moderator Title",
    "Moderator Roles",
    "Moderator Role",
  ]);

  for (const [index, name] of moderatorNames.entries()) {
    const parsed = parseSpeakerText(name);
    if (speakers.some((speaker) => speaker.name === parsed.name)) continue;
    speakers.unshift({
      company: parsed.company ?? moderatorCompanies[index],
      name: parsed.name,
      title: moderatorTitles[index] ?? "Moderator",
    });
  }

  const deduped = new Map<string, AgendaSpeaker>();
  for (const speaker of speakers) {
    const key = `${speaker.name}-${speaker.company ?? ""}`;
    if (!deduped.has(key)) deduped.set(key, speaker);
  }

  return [...deduped.values()];
}

function normalizeVariant(
  fields: Record<string, unknown>,
  title: string,
  tag: string | undefined,
): AgendaItem["variant"] {
  const value = getField(
    fields,
    ["Variant", "Display Type", "Display", "Kind", "Type Override"],
    asDisplayString,
  );
  const normalized = `${value ?? ""} ${tag ?? ""} ${title}`.toLowerCase();

  if (
    normalized.includes("break") ||
    normalized.includes("lunch") ||
    normalized.includes("closing")
  ) {
    return "static";
  }

  return "session";
}

function normalizeAgendaRecord(
  record: AirtableRecord,
  index: number,
): AgendaItem | null {
  const fields = record.fields ?? {};
  if (!isPublished(fields)) return null;

  const title = getField(
    fields,
    [
      "Title",
      "Session Title",
      "Event Title",
      "Name",
      "Session",
      "⚙️ Session Name",
      "Session Name",
      "Event",
      "Event Name",
      "Agenda Item",
    ],
    asDisplayString,
  );
  if (!title) return null;

  const day =
    getField(
      fields,
      [
        "Day - Format",
        "Day",
        "Agenda Day",
        "Event Day",
        "Schedule Day",
        "Tab",
        "Date",
        "Start Day (Friendly Format)_New",
        "Start Day (Friendly Format)",
        "⚙️ Start Day",
      ],
      normalizeDayValue,
    ) ?? "Day 1";

  const time = getField(
    fields,
    ["Start Time", "Start", "Time", "Start time", "Begins", "Start Date"],
    formatClockText,
  );
  const endTime = getField(
    fields,
    ["End Time", "End", "End time", "Ends", "End Date"],
    formatClockText,
  );
  const duration =
    getField(
      fields,
      ["Duration", "Length", "Session Duration", "Minutes"],
      asDuration,
    ) ?? durationFromTimes(time, endTime);
  const tag = getField(
    fields,
    [
      "Tag",
      "Format_Cleaned",
      "Format Cleaned",
      "Format",
      "Session Format",
      "Session Type",
      "Event Type",
      "Type",
      "Category",
    ],
    asDisplayString,
  );
  const sortOrder =
    getField(
      fields,
      ["Sort Order", "sortOrder", "Order", "order", "Priority", "priority"],
      asNumber,
    ) ??
    minutesFromClock(time) ??
    index;

  return {
    day,
    description: getField(
      fields,
      ["Description", "Session Description", "Abstract", "Details", "Overview"],
      asDisplayString,
    ),
    duration,
    id: record.id,
    location: getField(
      fields,
      ["Location", "Room", "Stage", "Venue", "Track"],
      asDisplayString,
    ),
    sortOrder,
    speakers: buildSpeakers(fields),
    tag,
    time: time ?? "TBD",
    title,
    variant: normalizeVariant(fields, title, tag),
  };
}

function daySortValue(day: string) {
  const normalized = day.toLowerCase();
  if (normalized.includes("pre")) return 0;
  const match = normalized.match(/\b([123])\b/);
  if (match) return Number(match[1]);
  return 99;
}

async function fetchAirtableAgenda(): Promise<AgendaItem[] | null> {
  const records = await getAirtableRecords({
    baseId: process.env.AIRTABLE_BASE_ID_AGENDA,
    cacheKey: "breakpoint-agenda",
    cacheTag: "breakpoint-agenda",
    label: "Breakpoint agenda",
    tableId: process.env.AIRTABLE_TABLE_ID_AGENDA,
    token: process.env.AIRTABLE_PAT,
    viewId: process.env.AIRTABLE_VIEW_ID_AGENDA,
  });

  if (!records) return null;

  const agenda: AgendaItem[] = [];
  for (const [recordIndex, record] of records.entries()) {
    const item = normalizeAgendaRecord(record, recordIndex);
    if (item) agenda.push(item);
  }

  return agenda.sort((a, b) => {
    const byDay = daySortValue(a.day) - daySortValue(b.day);
    if (byDay !== 0) return byDay;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
}

export const getAirtableAgenda = fetchAirtableAgenda;
