import { unstable_cache } from "next/cache";
import type {
  BreakpointSpeaker,
  SpeakerSession,
} from "@/content/speakers/types";

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_CACHE_SECONDS = 60 * 30;
const AIRTABLE_CACHE_TAG = "breakpoint-speakers";

type AirtableAttachment = {
  url?: string;
  thumbnails?: {
    large?: { url?: string };
    full?: { url?: string };
  };
};

type AirtableRecord = {
  fields?: Record<string, unknown>;
  id: string;
};

type AirtableListResponse = {
  offset?: string;
  records?: AirtableRecord[];
};

function asString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (Array.isArray(value)) {
    const text = value
      .map((item) => asString(item))
      .filter(Boolean)
      .join(", ");
    return text || undefined;
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

function normalizeFieldName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getField<T>(
  fields: Record<string, unknown>,
  names: string[],
  parser: (_value: unknown) => T | undefined,
): T | undefined {
  for (const name of names) {
    const parsed = parser(fields[name]);
    if (parsed !== undefined) return parsed;
  }

  const normalizedNames = new Set(names.map(normalizeFieldName));
  for (const [fieldName, value] of Object.entries(fields)) {
    if (!normalizedNames.has(normalizeFieldName(fieldName))) continue;
    const parsed = parser(value);
    if (parsed !== undefined) return parsed;
  }

  return undefined;
}

function getAttachmentUrl(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().startsWith("http")) {
    return value.trim();
  }

  if (!Array.isArray(value)) return undefined;

  for (const item of value as AirtableAttachment[]) {
    const url =
      item?.thumbnails?.large?.url ?? item?.thumbnails?.full?.url ?? item?.url;

    if (typeof url === "string" && url.trim()) {
      return url;
    }
  }

  return undefined;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPublished(fields: Record<string, unknown>) {
  const hidden = getField(
    fields,
    ["Hidden", "hidden", "Hide", "hide"],
    asBoolean,
  );
  if (hidden === true) return false;

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

  const published = getField(
    fields,
    ["Published", "published", "Visible", "visible", "Live", "live"],
    asBoolean,
  );
  if (published === false) return false;

  return true;
}

function formatUrl(value: string | undefined, host: string) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const withoutAt = trimmed.replace(/^@/, "");
  return `https://${host}/${withoutAt}`;
}

function formatWebsiteUrl(value: string | undefined) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function normalizeSession(fields: Record<string, unknown>): SpeakerSession {
  return {
    day: getField(
      fields,
      ["Day", "Session Day", "Event Day", "Agenda Day"],
      asString,
    ),
    format: getField(
      fields,
      [
        "Format",
        "Session Format",
        "Session Type",
        "Event Type",
        "Type",
        "Category",
      ],
      asString,
    ),
    title: getField(
      fields,
      [
        "Session",
        "Session Name",
        "Session Title",
        "Talk",
        "Talk Name",
        "Talk Title",
        "Event",
        "Event Name",
        "Presentation",
        "Presentation Title",
      ],
      asString,
    ),
  };
}

function normalizeSpeakerRecord(
  record: AirtableRecord,
  index: number,
): BreakpointSpeaker | null {
  const fields = record.fields ?? {};
  if (!isPublished(fields)) return null;

  const name = getField(
    fields,
    ["Name", "Full Name", "Speaker", "Speaker Name"],
    asString,
  );
  if (!name) return null;

  const sortOrder =
    getField(
      fields,
      ["Sort Order", "sortOrder", "Order", "order", "Priority", "priority"],
      asNumber,
    ) ?? index;
  const slug = getField(fields, ["Slug", "slug"], asString) ?? slugify(name);
  const session = normalizeSession(fields);

  return {
    company: getField(
      fields,
      ["Company", "Organization", "Organisation", "Org"],
      asString,
    ),
    id: record.id,
    image: getField(
      fields,
      [
        "Photo",
        "Image",
        "Headshot",
        "Speaker Image",
        "Profile Image",
        "Portrait",
      ],
      getAttachmentUrl,
    ),
    name,
    session:
      session.day || session.format || session.title ? session : undefined,
    slug,
    socials: {
      linkedin: formatUrl(
        getField(
          fields,
          [
            "LinkedIn",
            "Linkedin",
            "LinkedIn URL",
            "LinkedIn Profile",
            "LinkedIn Link",
          ],
          asString,
        ),
        "linkedin.com/in",
      ),
      website: formatWebsiteUrl(
        getField(
          fields,
          ["Website", "Website URL", "URL", "Personal Website", "Link"],
          asString,
        ),
      ),
      x: formatUrl(
        getField(
          fields,
          [
            "X",
            "Twitter",
            "Twitter Handle",
            "X Handle",
            "Twitter URL",
            "X URL",
          ],
          asString,
        ),
        "x.com",
      ),
    },
    sortOrder,
    title: getField(
      fields,
      [
        "Role or Title",
        "Title",
        "Job Title",
        "Role",
        "Position",
        "Speaker Title",
      ],
      asString,
    ),
  };
}

async function fetchAirtableSpeakers(): Promise<BreakpointSpeaker[] | null> {
  const token = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID_SPEAKERS;
  const tableId = process.env.AIRTABLE_TABLE_ID_SPEAKERS;
  const viewId = process.env.AIRTABLE_VIEW_ID_SPEAKERS;

  if (!token || !baseId || !tableId || !viewId) {
    console.warn("Breakpoint speaker Airtable config missing");
    return null;
  }

  try {
    const speakers: BreakpointSpeaker[] = [];
    let offset: string | undefined;

    do {
      const params = new URLSearchParams({
        pageSize: "100",
        view: viewId,
      });

      if (offset) params.set("offset", offset);

      const response = await fetch(
        `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableId)}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          next: {
            revalidate: AIRTABLE_CACHE_SECONDS,
            tags: [AIRTABLE_CACHE_TAG],
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Airtable request failed (${response.status})`);
      }

      const payload = (await response.json()) as AirtableListResponse;

      for (const [index, record] of (payload.records ?? []).entries()) {
        const speaker = normalizeSpeakerRecord(record, speakers.length + index);
        if (speaker) speakers.push(speaker);
      }

      offset = payload.offset;
    } while (offset);

    const deduped = new Map<string, BreakpointSpeaker>();
    for (const speaker of speakers) {
      if (!deduped.has(speaker.slug)) deduped.set(speaker.slug, speaker);
    }

    return [...deduped.values()].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Failed to load Breakpoint speakers from Airtable", error);
    return null;
  }
}

export const getAirtableSpeakers =
  process.env.NODE_ENV === "production"
    ? unstable_cache(fetchAirtableSpeakers, ["breakpoint-speakers-airtable"], {
        revalidate: AIRTABLE_CACHE_SECONDS,
        tags: [AIRTABLE_CACHE_TAG],
      })
    : fetchAirtableSpeakers;
