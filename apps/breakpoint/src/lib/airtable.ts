import "server-only";

import { unstable_cache } from "next/cache";

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

export const AIRTABLE_CACHE_SECONDS = 60 * 30;

export type AirtableRecord = {
  fields?: Record<string, unknown>;
  id: string;
};

type AirtableListResponse = {
  offset?: string;
  records?: AirtableRecord[];
};

export type AirtableSource = {
  baseId?: string;
  cacheKey: string;
  cacheTag: string;
  label: string;
  tableId?: string;
  token?: string;
  viewId?: string;
  fields?: string[];
};

export function asString(value: unknown): string | undefined {
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

export function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

export function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "1"].includes(normalized)) return true;
    if (["false", "no", "0"].includes(normalized)) return false;
  }
  return undefined;
}

export function normalizeFieldName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getField<T>(
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

export function isPublished(
  fields: Record<string, unknown>,
  { requirePublishFlag = false } = {},
) {
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
  if (requirePublishFlag && publishToWeb !== true) return false;

  const published = getField(
    fields,
    ["Published", "published", "Visible", "visible", "Live", "live"],
    asBoolean,
  );
  if (published === false) return false;

  return true;
}

type AirtableAttachment = {
  thumbnails?: {
    full?: { url?: unknown };
    large?: { url?: unknown };
  };
  url?: unknown;
};

export function getAttachmentUrl(value: unknown): string | undefined {
  if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) {
    return value.trim();
  }

  if (!Array.isArray(value)) return undefined;

  for (const item of value as AirtableAttachment[]) {
    const url =
      item?.thumbnails?.large?.url ?? item?.thumbnails?.full?.url ?? item?.url;

    if (typeof url === "string" && /^https?:\/\//i.test(url.trim())) {
      return url.trim();
    }
  }

  return undefined;
}

async function fetchAirtableRecords(
  source: Required<
    Pick<AirtableSource, "baseId" | "tableId" | "token" | "viewId">
  > &
    AirtableSource,
): Promise<AirtableRecord[] | null> {
  try {
    const records: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const params = new URLSearchParams({
        pageSize: "100",
        view: source.viewId,
      });

      for (const field of source.fields ?? []) {
        params.append("fields[]", field);
      }

      if (offset) params.set("offset", offset);

      const response = await fetch(
        `${AIRTABLE_API_BASE}/${source.baseId}/${encodeURIComponent(source.tableId)}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${source.token}`,
          },
          next: {
            revalidate: AIRTABLE_CACHE_SECONDS,
            tags: [source.cacheTag],
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Airtable request failed (${response.status})`);
      }

      const payload = (await response.json()) as AirtableListResponse;
      records.push(...(payload.records ?? []));
      offset = payload.offset;
    } while (offset);

    return records;
  } catch (error) {
    console.error(`Failed to load ${source.label} from Airtable`, error);
    return null;
  }
}

export async function getAirtableRecords(
  source: AirtableSource,
): Promise<AirtableRecord[] | null> {
  const { baseId, tableId, token, viewId } = source;

  if (!token || !baseId || !tableId || !viewId) {
    console.warn(`${source.label} Airtable config missing`);
    return null;
  }

  const loadRecords = () =>
    fetchAirtableRecords({
      ...source,
      baseId,
      tableId,
      token,
      viewId,
    });

  if (process.env.NODE_ENV !== "production") {
    return loadRecords();
  }

  return unstable_cache(
    loadRecords,
    ["breakpoint-airtable", source.cacheKey, baseId, tableId, viewId],
    {
      revalidate: AIRTABLE_CACHE_SECONDS,
      tags: [source.cacheTag],
    },
  )();
}
