import { unstable_cache } from "next/cache";
import speakersData from "@/data/speakers.json";
import type { Speaker } from "@/types/speakers";

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_CACHE_SECONDS = 60 * 30;

const DEFAULT_BASE_ID = "apph4y5MDXBxJ2uZy";
const DEFAULT_TABLE_ID = "tbljHJh3sx1zrwMSD";
const DEFAULT_VIEW_ID = "viwK6atCbxFZWGyvk";

type AirtableAttachment = {
  url?: string;
  thumbnails?: {
    large?: { url?: string };
    full?: { url?: string };
  };
};

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
    const parsed = parser(fields[name]);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function getAttachmentUrl(value: unknown): string | undefined {
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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return {
      firstName: parts[0]?.toUpperCase() ?? "",
      lastName: "",
    };
  }

  return {
    firstName: parts.slice(0, -1).join(" ").toUpperCase(),
    lastName: parts[parts.length - 1]?.toUpperCase() ?? "",
  };
}

function isPublished(fields: Record<string, unknown>) {
  const explicitHidden = getField(
    fields,
    ["Hidden", "hidden", "Hide", "hide"],
    asBoolean,
  );
  if (explicitHidden === true) return false;

  const explicitPublished = getField(
    fields,
    ["Published", "published", "Visible", "visible", "Live", "live"],
    asBoolean,
  );
  if (explicitPublished === false) return false;

  return true;
}

function normalizeSpeakerRecord(
  record: AirtableRecord,
  index: number,
): {
  speaker: Speaker;
  sortOrder: number;
} | null {
  const fields = record.fields ?? {};
  if (!isPublished(fields)) return null;

  const name = getField(
    fields,
    ["Name", "name", "Speaker", "speaker"],
    asString,
  );
  if (!name) return null;

  const providedFirstName = getField(
    fields,
    ["First Name", "firstName", "First name"],
    asString,
  );
  const providedLastName = getField(
    fields,
    ["Last Name", "lastName", "Last name"],
    asString,
  );
  const split = splitName(name);

  const title =
    getField(
      fields,
      ["Title", "title", "Role", "role", "Job Title", "jobTitle"],
      asString,
    ) ?? "";
  const company =
    getField(
      fields,
      ["Company", "company", "Organization", "organization"],
      asString,
    ) ?? "";
  const image =
    getField(
      fields,
      ["Photo", "photo", "Image", "image", "Headshot", "headshot"],
      getAttachmentUrl,
    ) ?? "";

  const slug =
    getField(fields, ["Slug", "slug"], asString) ?? slugify(name || record.id);
  const sortOrder =
    getField(
      fields,
      ["Sort Order", "sortOrder", "Order", "order", "Priority", "priority"],
      asNumber,
    ) ?? index;

  const twitter =
    getField(
      fields,
      [
        "Twitter",
        "twitter",
        "X",
        "x",
        "Twitter Handle",
        "twitterHandle",
        "X Handle",
      ],
      asString,
    ) ?? undefined;

  return {
    sortOrder,
    speaker: {
      slug,
      name,
      firstName: (providedFirstName ?? split.firstName).toUpperCase(),
      lastName: (providedLastName ?? split.lastName).toUpperCase(),
      title,
      company,
      image,
      twitter,
    },
  };
}

async function fetchAirtableSpeakers(): Promise<Speaker[]> {
  const token = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID_SPEAKERS ?? DEFAULT_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID_SPEAKERS ?? DEFAULT_TABLE_ID;
  const viewId = process.env.AIRTABLE_VIEW_ID_SPEAKERS ?? DEFAULT_VIEW_ID;

  if (!token) {
    return speakersData.speakers;
  }

  try {
    const speakers: Array<{ speaker: Speaker; sortOrder: number }> = [];
    let offset: string | undefined;

    do {
      const params = new URLSearchParams({
        view: viewId,
        pageSize: "100",
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
            tags: ["miami-speakers"],
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Airtable request failed (${response.status})`);
      }

      const payload = (await response.json()) as AirtableListResponse;

      for (const [index, record] of (payload.records ?? []).entries()) {
        const normalized = normalizeSpeakerRecord(
          record,
          speakers.length + index,
        );
        if (normalized) speakers.push(normalized);
      }

      offset = payload.offset;
    } while (offset);

    const deduped = new Map<string, { speaker: Speaker; sortOrder: number }>();
    for (const entry of speakers) {
      if (!deduped.has(entry.speaker.slug)) {
        deduped.set(entry.speaker.slug, entry);
      }
    }

    return [...deduped.values()]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((entry) => entry.speaker);
  } catch (error) {
    console.error("Failed to load Miami speakers from Airtable", error);
    return speakersData.speakers;
  }
}

export const getMiamiSpeakers = unstable_cache(
  fetchAirtableSpeakers,
  ["miami-speakers-airtable"],
  {
    revalidate: AIRTABLE_CACHE_SECONDS,
  },
);
