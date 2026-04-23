import { unstable_cache } from "next/cache";
import miamiAgendaStatic from "@/data/miami/agenda.json";

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_CACHE_SECONDS = 60 * 30;

type SessionType =
  | "keynote"
  | "panel"
  | "fireside"
  | "lightning"
  | "break"
  | "demo"
  | "closing";

const SESSION_TYPES: SessionType[] = [
  "keynote",
  "panel",
  "fireside",
  "lightning",
  "break",
  "demo",
  "closing",
];

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

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => (typeof item === "string" ? item.trim() : undefined))
      .filter((item): item is string => Boolean(item));
    return items.length ? items : undefined;
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "1"].includes(normalized)) return true;
    if (["false", "no", "0"].includes(normalized)) return false;
  }
  return undefined;
}

function getField<T>(
  fields: Record<string, unknown>,
  names: string[],
  parser: (value: unknown) => T | undefined,
): T | undefined {
  for (const name of names) {
    if (!(name in fields)) continue;
    const parsed = parser(fields[name]);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function isPublished(fields: Record<string, unknown>) {
  const explicitHidden = getField(
    fields,
    ["Hidden", "hidden", "Hide", "hide"],
    asBoolean,
  );
  if (explicitHidden === true) return false;

  const publishToWeb = getField(
    fields,
    [
      "Publish To Web",
      "Publish to Web",
      "publish to web",
      "publishToWeb",
      "publish_to_web",
    ],
    asBoolean,
  );
  if (publishToWeb === false) return false;

  const explicitPublished = getField(
    fields,
    ["Published", "published", "Visible", "visible", "Live", "live"],
    asBoolean,
  );
  if (explicitPublished === false) return false;

  return true;
}

function normalizeType(value: string | undefined): SessionType {
  if (!value) return "panel";
  const normalized = value.trim().toLowerCase();
  if (SESSION_TYPES.includes(normalized as SessionType)) {
    return normalized as SessionType;
  }
  if (normalized.includes("keynote")) return "keynote";
  if (normalized.includes("fireside")) return "fireside";
  if (normalized.includes("lightning")) return "lightning";
  if (normalized.includes("demo")) return "demo";
  if (normalized.includes("closing")) return "closing";
  if (
    normalized.includes("break") ||
    normalized.includes("lunch") ||
    normalized.includes("coffee") ||
    normalized.includes("doors")
  ) {
    return "break";
  }
  if (normalized.includes("panel")) return "panel";
  return "panel";
}

function parseSpeakers(value: unknown): AgendaSpeaker[] {
  const raw =
    asStringArray(value) ?? (asString(value) ? [asString(value)!] : []);
  return raw
    .flatMap((entry) =>
      entry
        .split(/\s*(?:;|\n|\|)\s*/)
        .map((part) => part.trim())
        .filter(Boolean),
    )
    .map((entry) => {
      // Accept "Name (Title, Company)" or "Name - Title, Company" or plain "Name, Company"
      const parenMatch = entry.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
      if (parenMatch?.[1] && parenMatch[2]) {
        const name = parenMatch[1].trim();
        const inside = parenMatch[2].split(",").map((p) => p.trim());
        const [title, company] =
          inside.length >= 2
            ? [inside[0], inside.slice(1).join(", ")]
            : [undefined, inside[0]];
        return { name, title, company };
      }
      const dashMatch = entry.match(/^(.+?)\s*[-–]\s*(.+)$/);
      if (dashMatch?.[1] && dashMatch[2]) {
        const name = dashMatch[1].trim();
        const rest = dashMatch[2].split(",").map((p) => p.trim());
        const [title, company] =
          rest.length >= 2
            ? [rest[0], rest.slice(1).join(", ")]
            : [undefined, rest[0]];
        return { name, title, company };
      }
      const commaMatch = entry.split(",").map((p) => p.trim());
      if (commaMatch.length >= 2) {
        return {
          name: commaMatch[0],
          company: commaMatch.slice(1).join(", "),
        };
      }
      return { name: entry };
    })
    .filter((s) => Boolean(s.name));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSession(
  record: AirtableRecord,
  index: number,
): { session: AgendaSession; sortOrder: number } | null {
  const fields = record.fields ?? {};
  if (!isPublished(fields)) return null;

  const title = getField(
    fields,
    ["Title", "title", "Session", "session", "Name", "name"],
    asString,
  );
  if (!title) return null;

  const time =
    getField(
      fields,
      ["Time", "time", "Start Time", "startTime", "Time Slot", "timeSlot"],
      asString,
    ) ?? "";

  const type = normalizeType(
    getField(
      fields,
      ["Type", "type", "Session Type", "sessionType", "Format", "format"],
      asString,
    ),
  );

  const location =
    getField(
      fields,
      ["Location", "location", "Room", "room", "Stage", "stage"],
      asString,
    ) ?? "";

  const subtitle = getField(
    fields,
    [
      "Subtitle",
      "subtitle",
      "Description",
      "description",
      "Summary",
      "summary",
    ],
    asString,
  );

  const duration = getField(
    fields,
    ["Duration", "duration", "Length", "length"],
    asString,
  );

  const speakers = parseSpeakers(
    fields["Speakers"] ??
      fields["speakers"] ??
      fields["Panelists"] ??
      fields["panelists"],
  );

  const moderatorList = parseSpeakers(
    fields["Moderator"] ??
      fields["moderator"] ??
      fields["Host"] ??
      fields["host"],
  );
  const moderator = moderatorList[0];

  const slug =
    getField(fields, ["Slug", "slug", "ID", "id"], asString) ??
    (slugify(`${time}-${title}`) || record.id);

  const sortOrder =
    getField(
      fields,
      ["Sort Order", "sortOrder", "Order", "order", "Priority", "priority"],
      asNumber,
    ) ?? index;

  return {
    sortOrder,
    session: {
      id: slug,
      time,
      title,
      subtitle,
      type,
      location,
      duration,
      moderator,
      speakers,
    },
  };
}

async function fetchAirtableSessions(): Promise<AgendaSession[] | null> {
  const token = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID_SPEAKERS;
  const tableId = process.env.AIRTABLE_TABLE_ID_SPEAKERS;
  const viewId = process.env.AIRTABLE_VIEW_ID_SPEAKERS;

  if (!token || !baseId || !tableId) {
    console.warn(
      "Miami agenda Airtable configuration missing; returning empty sessions",
    );
    return null;
  }

  try {
    const sessions: Array<{ session: AgendaSession; sortOrder: number }> = [];
    let offset: string | undefined;

    do {
      const params = new URLSearchParams({ pageSize: "100" });
      if (viewId) params.set("view", viewId);
      if (offset) params.set("offset", offset);

      const response = await fetch(
        `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableId)}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: {
            revalidate: AIRTABLE_CACHE_SECONDS,
            tags: ["miami-agenda"],
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Airtable request failed (${response.status})`);
      }

      const payload = (await response.json()) as AirtableListResponse;

      for (const [index, record] of (payload.records ?? []).entries()) {
        const normalized = normalizeSession(record, sessions.length + index);
        if (normalized) sessions.push(normalized);
      }

      offset = payload.offset;
    } while (offset);

    return sessions
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((entry) => entry.session);
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
