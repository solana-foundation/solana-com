import { unstable_cache } from "next/cache";
import miamiAgendaStatic from "@/data/miami/agenda.json";

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_CACHE_SECONDS = 60 * 30;
const EVENT_TIMEZONE = "America/New_York";

// Defaults baked in so we don't need Miami-specific env vars.
// Override via the matching AIRTABLE_*_MIAMI_AGENDA env var if the schema moves.
const DEFAULT_BASE_ID = "apph4y5MDXBxJ2uZy";
const DEFAULT_AGENDA_TABLE_ID = "tbl802700wD64jBNI";
const DEFAULT_AGENDA_VIEW_ID = "viwphM46UvfUrP30z"; // "All Stages"
const DEFAULT_FORMAT_TABLE_ID = "tbltJYMgzlVFeibNU";

type SessionType =
  | "keynote"
  | "panel"
  | "fireside"
  | "lightning"
  | "break"
  | "demo"
  | "closing";

// Exact values from the Format table's primary "Name" column.
const FORMAT_TO_TYPE: Record<string, SessionType> = {
  "Break (15 min)": "break",
  "Break (45 min)": "break",
  "Debate (30 min)": "panel",
  "Fireside (15 min)": "fireside",
  "Fireside (20 min)": "fireside",
  "Keynote (10 min)": "keynote",
  "Keynote (15 min)": "keynote",
  "Open/Close (5 min)": "keynote",
  "Panel (20 min)": "panel",
  "Panel (25 min)": "panel",
  "Product Keynote (5 min)": "keynote",
  "Product Keynote (7 min)": "keynote",
  "Reacts (30 min)": "lightning",
};

export interface AgendaSpeaker {
  name?: string;
  title?: string;
  company?: string;
}

export interface AgendaSession {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  type: SessionType;
  location: string;
  duration?: string;
  moderator?: AgendaSpeaker;
  speakers: AgendaSpeaker[];
}

export interface AgendaData {
  event: {
    name: string;
    date?: string;
    venue?: string;
    hall?: string;
    mc?: string;
  };
  focusTopics: Array<{ title: string; description: string }>;
  sessions: AgendaSession[];
}

type AirtableRecord = {
  id: string;
  fields?: Record<string, unknown>;
};

type AirtableListResponse = {
  records?: AirtableRecord[];
  offset?: string;
};

function getAirtableConfig() {
  const token = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID_SPEAKERS ?? DEFAULT_BASE_ID;
  const tableId =
    process.env.AIRTABLE_TABLE_ID_MIAMI_AGENDA ?? DEFAULT_AGENDA_TABLE_ID;
  const viewId =
    process.env.AIRTABLE_VIEW_ID_MIAMI_AGENDA ?? DEFAULT_AGENDA_VIEW_ID;
  const formatTableId = DEFAULT_FORMAT_TABLE_ID;
  return { token, baseId, tableId, viewId, formatTableId };
}

async function fetchAll(
  baseId: string,
  tableId: string,
  token: string,
  viewId?: string,
  tag?: string,
): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (viewId) params.set("view", viewId);
    if (offset) params.set("offset", offset);
    const response = await fetch(
      `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableId)}?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: {
          revalidate: AIRTABLE_CACHE_SECONDS,
          tags: tag ? [tag] : undefined,
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `Airtable ${tableId} request failed (${response.status})`,
      );
    }
    const payload = (await response.json()) as AirtableListResponse;
    for (const record of payload.records ?? []) records.push(record);
    offset = payload.offset;
  } while (offset);
  return records;
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    const single = asString(value);
    return single ? [single] : [];
  }
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

function toTimeParts(iso: string): { time: string; period: string } | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const formatted = date.toLocaleTimeString("en-US", {
    timeZone: EVENT_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const match = formatted.match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  return { time: match[1]!, period: match[2]!.toUpperCase() };
}

function formatTimeRange(startISO?: string, endISO?: string): string {
  const start = startISO ? toTimeParts(startISO) : null;
  const end = endISO ? toTimeParts(endISO) : null;
  if (!start) return "";
  if (!end) return `${start.time} ${start.period}`;
  if (start.period === end.period) {
    return `${start.time} – ${end.time} ${end.period}`;
  }
  return `${start.time} ${start.period} – ${end.time} ${end.period}`;
}

// Strip leading non-alphanumeric characters (status emoji like ⏰, ✅, ⚠️)
// before the first letter or digit.
function stripLeadingJunk(name: string): string {
  return name.replace(/^[^A-Za-z0-9]+/u, "").trim();
}

function parseSpeakerString(entry: string): AgendaSpeaker | null {
  const trimmed = stripLeadingJunk(entry);
  if (!trimmed) return null;

  // "Name (Title, Company)" or "Name (Company)"
  const paren = trimmed.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (paren?.[1] && paren[2]) {
    const name = paren[1].trim();
    const inside = paren[2].split(",").map((p) => p.trim());
    if (inside.length >= 2) {
      return { name, title: inside[0], company: inside.slice(1).join(", ") };
    }
    return { name, company: inside[0] };
  }

  // "Name - Company" (space-dash/en-dash-space separator)
  const dash = trimmed.match(/^(.+?)\s+[-–]\s+(.+)$/);
  if (dash?.[1] && dash[2]) {
    return { name: dash[1].trim(), company: dash[2].trim() };
  }

  // "Name, Company"
  const parts = trimmed.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    return { name: parts[0], company: parts.slice(1).join(", ") };
  }

  return { name: trimmed };
}

function parseSpeakers(value: unknown): AgendaSpeaker[] {
  return asStringArray(value)
    .flatMap((entry) =>
      entry
        .split(/\s*(?:;|\n|\|)\s*/)
        .map((part) => part.trim())
        .filter(Boolean),
    )
    .map(parseSpeakerString)
    .filter((s): s is AgendaSpeaker => Boolean(s?.name));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveFormatType(
  formatField: unknown,
  formatMap: Map<string, string>,
): SessionType {
  const ids = Array.isArray(formatField) ? formatField : [];
  for (const id of ids) {
    if (typeof id !== "string") continue;
    const name = formatMap.get(id);
    if (name && FORMAT_TO_TYPE[name]) return FORMAT_TO_TYPE[name]!;
  }
  // Fallback: if someone enabled a string lookup instead of the linked record
  const asText = asString(formatField);
  if (asText && FORMAT_TO_TYPE[asText]) return FORMAT_TO_TYPE[asText]!;
  return "panel";
}

function normalizeSession(
  record: AirtableRecord,
  index: number,
  formatMap: Map<string, string>,
): { session: AgendaSession; sortOrder: number } | null {
  const fields = record.fields ?? {};

  // Publish gate: checkbox is only present on records where it's true.
  if (fields["Publish to web"] !== true) return null;

  const title = asString(fields["⚙️ Session Name"]);
  if (!title) return null;

  const startISO = asString(fields["Start Time"]);
  const endISO = asString(fields["End Time"]);
  const time = formatTimeRange(startISO, endISO);

  const type = resolveFormatType(fields["Format"], formatMap);
  const location = asString(fields["Stage"]) ?? "";
  const subtitle = asString(fields["Description"]);

  const speakers = parseSpeakers(fields["Speaker Name and Company"]);
  const moderator = parseSpeakers(fields["Moderator Name and Company"])[0];

  const sortOrder = asNumber(fields["Sequence Ordinal"]) ?? index;
  const slug = slugify(`${time}-${title}`) || record.id;

  return {
    sortOrder,
    session: {
      id: slug,
      time,
      title,
      subtitle,
      type,
      location,
      moderator,
      speakers,
    },
  };
}

async function fetchFormatMap(
  baseId: string,
  formatTableId: string,
  token: string,
): Promise<Map<string, string>> {
  const records = await fetchAll(
    baseId,
    formatTableId,
    token,
    undefined,
    "miami-agenda-formats",
  );
  const map = new Map<string, string>();
  for (const record of records) {
    const name =
      asString(record.fields?.["Format"]) ?? asString(record.fields?.["Name"]);
    if (name) map.set(record.id, name);
  }
  return map;
}

async function fetchAirtableSessions(): Promise<AgendaSession[] | null> {
  const { token, baseId, tableId, viewId, formatTableId } = getAirtableConfig();
  if (!token) {
    console.warn("Miami agenda: AIRTABLE_PAT missing");
    return null;
  }

  try {
    const [records, formatMap] = await Promise.all([
      fetchAll(baseId, tableId, token, viewId, "miami-agenda"),
      fetchFormatMap(baseId, formatTableId, token),
    ]);

    const sessions = records
      .map((record, index) => normalizeSession(record, index, formatMap))
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((entry) => entry.session);

    return sessions;
  } catch (error) {
    console.error("Failed to load Miami agenda from Airtable", error);
    return null;
  }
}

const loadSessions =
  process.env.NODE_ENV === "production"
    ? unstable_cache(fetchAirtableSessions, ["miami-agenda-airtable"], {
        revalidate: AIRTABLE_CACHE_SECONDS,
      })
    : fetchAirtableSessions;

export async function getMiamiAgenda(): Promise<AgendaData> {
  const sessions = (await loadSessions()) ?? [];
  return {
    ...(miamiAgendaStatic as Omit<AgendaData, "sessions">),
    sessions,
  };
}
