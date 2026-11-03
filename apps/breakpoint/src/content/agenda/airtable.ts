import {
  AGENDA_DAYS,
  type AgendaItem,
  type AgendaSpeaker,
} from "@/content/agenda/types";
import {
  asNumber,
  asString,
  getAirtableRecords,
  getField,
  isPublished,
  type AirtableRecord,
} from "@/lib/airtable";

const LONDON_TIME_ZONE = "Europe/London";

/**
 * The agenda's "Web Publishing Status" column links to a small status table
 * whose rows are named Time, Title, Speaker, Description and Do not publish.
 * The events team ticks those per session as copy is approved, so the site
 * only shows the parts that have been signed off. Override the table and view
 * through env vars if the Airtable schema moves.
 */
const DEFAULT_PUBLISHING_STATUS_TABLE_ID = "tblHvCpfpI5CTlPDx";
const DEFAULT_PUBLISHING_STATUS_VIEW_ID = "viwqFPlX2sI3F97Gl";

/** Known status records, used when the status table cannot be read. */
const DEFAULT_PUBLISHING_STATUS_NAMES: Record<string, string> = {
  recEP0WiwY2y8dx22: "Description",
  recOn6L12BmGHDOno: "Title",
  recRQY6k9lMzQnFk9: "Speaker",
  recqpel3kBGWP6Xkx: "Do not publish",
  recwtiuTWTluBFNAE: "Time",
};

const AGENDA_FIELDS = [
  "⚙️ Session Name",
  "Session",
  "Description",
  "Start Time",
  "End Time",
  "⚙️ Start Day",
  "Duration",
  "Stage",
  "Asset Class",
  "Format_Cleaned",
  "Order",
  "Sequence Ordinal",
  "Onboarded Speakers",
  "Moderator",
  "Speaker Name and Company",
  "Moderator Name and Company",
  "Role or Title (from Onboarded Speakers)",
  "Role or Title (from Moderator)",
  "Confirmed Speakers Full Name",
  "Confirmed Moderator Full Name",
  "Web Publishing Status",
] as const;

/** Internal scheduling tags that are not asset classes attendees care about. */
const HIDDEN_ASSET_CLASSES = new Set(["anchor", "break", "open"]);

export type PublishingFlags = {
  description: boolean;
  doNotPublish: boolean;
  speakers: boolean;
  time: boolean;
  title: boolean;
};

type StatusNames = Record<string, string>;

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

/**
 * Airtable lookups arrive as arrays with one entry per linked record, so each
 * entry is kept whole even when it contains a comma ("Mitsui & Co., Ltd").
 * Formula fields arrive as one comma-joined string and are split on request.
 */
function asStringList(
  value: unknown,
  splitCommas = false,
): string[] | undefined {
  if (Array.isArray(value)) {
    const values = value.flatMap((item) => asStringList(item, false) ?? []);
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

  const dayMatch = normalized.match(/^day\s*([123])$/);
  if (dayMatch) return `Day ${dayMatch[1]}`;

  if (/^[123]$/.test(normalized)) return `Day ${normalized}`;

  const key = dateKey(text);
  const day = AGENDA_DAYS.find((candidate) => candidate.date === key);
  if (day) return day.key;

  return key ? undefined : text;
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
  const cleanValue = value.replace(/^[^\p{L}\p{N}]+/u, "").trim();
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

function buildPeople(
  names: string[],
  companies: string[],
  titles: string[],
  ids: string[],
  isModerator: boolean,
): AgendaSpeaker[] {
  const alignedIds = ids.length === names.length ? ids : [];

  return names.map((name, index) => {
    const parsed = parseSpeakerText(name);
    const title =
      titles[index]?.trim() || (isModerator ? "Moderator" : undefined);

    return {
      company:
        parsed.company ??
        companies[index] ??
        (names.length === 1 ? companies[0] : undefined),
      id: alignedIds[index],
      ...(isModerator ? { isModerator } : {}),
      name: parsed.name,
      title,
    };
  });
}

function buildSpeakers(fields: Record<string, unknown>): AgendaSpeaker[] {
  const speakerNames = fieldList(
    fields,
    [
      "Speaker Name and Company",
      "Confirmed Speakers Full Name",
      "Confirmed Speakers Full Name (Formatted)",
      "Confirmed Speakers Full Name (Luma)",
      "Confirmed Speakers, Concise (Luma)",
      "Speakers and Moderators, Concise (Luma)",
      "Speakers and Moderators (Luma)",
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

  const speakers = buildPeople(
    speakerNames,
    fieldList(fields, [
      "Speaker Companies",
      "Speaker Company",
      "Companies",
      "Company",
      "Organizations",
      "Organization",
      "Organisation",
    ]),
    fieldList(fields, [
      "Role or Title (from Onboarded Speakers)",
      "Speaker Titles",
      "Speaker Title",
      "Speaker Roles",
      "Speaker Role",
      "Speaker Job Titles",
      "Speaker Job Title",
      "Speaker Role Lookup",
      "Roles",
    ]),
    fieldList(fields, ["Onboarded Speakers"]).filter(isLinkedRecordId),
    false,
  );

  const moderatorNames = fieldList(
    fields,
    [
      "Moderator Name and Company",
      "Confirmed Moderator Full Name",
      "Moderator Names",
      "Moderator Name",
      "Moderators",
    ],
    true,
  ).filter((name) => !isLinkedRecordId(name));

  const moderators = buildPeople(
    moderatorNames,
    fieldList(fields, ["Moderator Companies", "Moderator Company"]),
    fieldList(fields, [
      "Role or Title (from Moderator)",
      "Moderator Titles",
      "Moderator Title",
      "Moderator Roles",
      "Moderator Role",
    ]),
    fieldList(fields, ["Moderator"]).filter(isLinkedRecordId),
    true,
  );

  const deduped = new Map<string, AgendaSpeaker>();
  for (const person of [...speakers, ...moderators]) {
    const key = `${person.name}-${person.company ?? ""}`;
    if (!deduped.has(key)) deduped.set(key, person);
  }

  return [...deduped.values()];
}

function buildAssetClasses(fields: Record<string, unknown>): string[] {
  return fieldList(fields, [
    "Asset Class",
    "Asset Classes",
    "Asset Type",
    "Track",
    "Theme",
  ]).filter((value) => !HIDDEN_ASSET_CLASSES.has(value.toLowerCase()));
}

/** Scheduling formats that read awkwardly as a public session type. */
const FORMAT_LABELS: Record<string, string> = {
  "day 1 open": "Welcome",
  "open/close": "Remarks",
};

/** "Royal Exchange Keynote" reads as "Keynote" once the stage is shown beside it. */
function normalizeFormat(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const stripped = value.replace(/^royal exchange\s+/i, "").trim() || value;
  return FORMAT_LABELS[stripped.toLowerCase()] ?? stripped;
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
  // Whole words only: "Breakpoint 2027 Announcement" is a session, "Break" is not.
  const isBreak = /\b(break|lunch)\b/i.test(
    `${value ?? ""} ${tag ?? ""} ${title}`,
  );

  return isBreak ? "static" : "session";
}

export function readPublishingFlags(
  fields: Record<string, unknown>,
  statusNames: StatusNames = DEFAULT_PUBLISHING_STATUS_NAMES,
): PublishingFlags | null {
  const raw = fieldList(fields, [
    "Web Publishing Status",
    "Publishing Status",
    "Web Status",
  ]);
  if (raw.length === 0) return null;

  const names = raw.map((value) =>
    (statusNames[value] ?? value).trim().toLowerCase(),
  );
  const has = (needle: string) => names.some((name) => name.includes(needle));

  return {
    description: has("description"),
    doNotPublish: has("do not publish") || has("unpublish"),
    speakers: has("speaker"),
    time: has("time"),
    title: has("title"),
  };
}

export function normalizeAgendaRecord(
  record: AirtableRecord,
  index: number,
  statusNames: StatusNames = DEFAULT_PUBLISHING_STATUS_NAMES,
): AgendaItem | null {
  const fields = record.fields ?? {};
  if (!isPublished(fields)) return null;

  // A session with no publishing status has not been reviewed for the web.
  const flags = readPublishingFlags(fields, statusNames);
  if (!flags || flags.doNotPublish || !flags.title) return null;

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
        "Day",
        "Agenda Day",
        "Event Day",
        "Schedule Day",
        "Tab",
        "⚙️ Start Day",
        "Start Time",
        "Date",
        "Start Day (Friendly Format)_New",
        "Start Day (Friendly Format)",
      ],
      normalizeDayValue,
    ) ?? "Day 1";

  const startTime = getField(
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
    ) ?? durationFromTimes(startTime, endTime);
  const format = normalizeFormat(
    getField(
      fields,
      [
        "Format_Cleaned",
        "Format Cleaned",
        "Format",
        "Session Format",
        "Session Type",
        "Tag",
        "Event Type",
        "Type",
        "Category",
      ],
      asDisplayString,
    ),
  );
  const sortOrder =
    getField(
      fields,
      ["Sort Order", "sortOrder", "Order", "order", "Priority", "priority"],
      asNumber,
    ) ??
    minutesFromClock(startTime) ??
    index;

  const speakers = flags.speakers ? buildSpeakers(fields) : [];
  const speakerIds = flags.speakers
    ? [
        ...new Set(
          [
            ...fieldList(fields, ["Onboarded Speakers"]),
            ...fieldList(fields, ["Moderator"]),
            ...speakers.map((speaker) => speaker.id ?? ""),
          ].filter(isLinkedRecordId),
        ),
      ]
    : [];

  return {
    assetClasses: buildAssetClasses(fields),
    day,
    description: flags.description
      ? getField(
          fields,
          [
            "Description",
            "Session Description",
            "Abstract",
            "Details",
            "Overview",
          ],
          asDisplayString,
        )
      : undefined,
    duration,
    format,
    id: record.id,
    location: getField(
      fields,
      ["Stage", "Location", "Room", "Venue", "Track"],
      asDisplayString,
    ),
    sortOrder,
    speakerIds,
    speakers,
    tag: format,
    time: flags.time ? (startTime ?? "TBC") : "TBC",
    title,
    variant: normalizeVariant(fields, title, format),
  };
}

function daySortValue(day: string) {
  const index = AGENDA_DAYS.findIndex((candidate) => candidate.key === day);
  return index === -1 ? AGENDA_DAYS.length : index;
}

async function fetchPublishingStatusNames(): Promise<StatusNames> {
  const records = await getAirtableRecords({
    baseId: process.env.AIRTABLE_BASE_ID_AGENDA,
    cacheKey: "breakpoint-agenda-publishing-status",
    cacheTag: "breakpoint-agenda",
    fields: ["Web Status"],
    label: "Breakpoint agenda publishing status",
    tableId:
      process.env.AIRTABLE_TABLE_ID_AGENDA_PUBLISHING_STATUS ||
      DEFAULT_PUBLISHING_STATUS_TABLE_ID,
    token: process.env.AIRTABLE_PAT,
    viewId:
      process.env.AIRTABLE_VIEW_ID_AGENDA_PUBLISHING_STATUS ||
      DEFAULT_PUBLISHING_STATUS_VIEW_ID,
  });

  const names: StatusNames = {};
  for (const record of records ?? []) {
    const name = getField(
      record.fields ?? {},
      ["Web Status", "Status", "Name"],
      asString,
    );
    if (name) names[record.id] = name;
  }

  return Object.keys(names).length > 0
    ? names
    : DEFAULT_PUBLISHING_STATUS_NAMES;
}

async function fetchAirtableAgenda(): Promise<AgendaItem[] | null> {
  const [records, statusNames] = await Promise.all([
    getAirtableRecords({
      baseId: process.env.AIRTABLE_BASE_ID_AGENDA,
      cacheKey: "breakpoint-agenda",
      cacheTag: "breakpoint-agenda",
      fields: [...AGENDA_FIELDS],
      label: "Breakpoint agenda",
      tableId: process.env.AIRTABLE_TABLE_ID_AGENDA,
      token: process.env.AIRTABLE_PAT,
      viewId: process.env.AIRTABLE_VIEW_ID_AGENDA,
    }),
    fetchPublishingStatusNames(),
  ]);

  if (!records) return null;

  const agenda: AgendaItem[] = [];
  for (const [recordIndex, record] of records.entries()) {
    const item = normalizeAgendaRecord(record, recordIndex, statusNames);
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
