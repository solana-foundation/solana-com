import "server-only";
import { unstable_cache } from "next/cache";
import {
  AIRTABLE_API_BASE,
  fetchAirtableJson,
  type AirtableFetchOptions,
} from "./airtable";
import {
  mapShanghaiAgendaRecords,
  SHANGHAI_AGENDA_FIELD_IDS,
  SHANGHAI_FORMAT_NAME_FIELD_ID,
  SHANGHAI_FORMAT_TABLE_ID,
  type ShanghaiAgendaSession,
  type ShanghaiAgendaSourceRecord,
} from "./shanghai-agenda-mapper";

const BASE_ID = "applsN0LSl2rps6le";
const SESSIONS_TABLE_ID = "tblhmC8GAuTrrebqA";
const SHANGHAI_VIEW_ID = "viwRCpQEfJqc2C2ci";
const AIRTABLE_CACHE_SECONDS = 60;
const AIRTABLE_FORMAT_BATCH_SIZE = 50;
const AIRTABLE_NO_STORE_OPTIONS: AirtableFetchOptions = { cache: "no-store" };
const PUBLIC_SOURCE_FIELD_IDS = Object.values(SHANGHAI_AGENDA_FIELD_IDS);
const IGNORE_PUBLICATION_FLAGS =
  process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

type AirtableListResponse = {
  records?: ShanghaiAgendaSourceRecord[];
  offset?: string;
};

function getLinkedFormatRecordIds(
  record: ShanghaiAgendaSourceRecord,
): string[] {
  const linkedFormats = record.fields?.[SHANGHAI_AGENDA_FIELD_IDS.format];
  if (!Array.isArray(linkedFormats)) return [];

  return linkedFormats.flatMap((format) => {
    if (typeof format === "string") return [format];
    if (
      format !== null &&
      typeof format === "object" &&
      "id" in format &&
      typeof format.id === "string"
    ) {
      return [format.id];
    }
    return [];
  });
}

async function fetchFormatNames(
  records: readonly ShanghaiAgendaSourceRecord[],
  candidateIds: ReadonlySet<string>,
  token: string,
): Promise<Record<string, string>> {
  const formatRecordIds = [
    ...new Set(
      records
        .filter((record) => candidateIds.has(record.id))
        .flatMap(getLinkedFormatRecordIds),
    ),
  ];
  const names: Record<string, string> = {};

  for (
    let index = 0;
    index < formatRecordIds.length;
    index += AIRTABLE_FORMAT_BATCH_SIZE
  ) {
    const batch = formatRecordIds.slice(
      index,
      index + AIRTABLE_FORMAT_BATCH_SIZE,
    );
    const conditions = batch.map((id) => `RECORD_ID()="${id}"`);
    const formula =
      conditions.length === 1 ? conditions[0]! : `OR(${conditions.join(",")})`;
    const params = new URLSearchParams({
      pageSize: "100",
      returnFieldsByFieldId: "true",
      filterByFormula: formula,
    });
    params.append("fields[]", SHANGHAI_FORMAT_NAME_FIELD_ID);

    let offset: string | undefined;
    do {
      if (offset) params.set("offset", offset);

      const payload = await fetchAirtableJson<AirtableListResponse>(
        `${AIRTABLE_API_BASE}/${BASE_ID}/${encodeURIComponent(SHANGHAI_FORMAT_TABLE_ID)}?${params}`,
        token,
        AIRTABLE_NO_STORE_OPTIONS,
        "Shanghai agenda format request",
      );

      for (const record of payload.records ?? []) {
        const name = record.fields?.[SHANGHAI_FORMAT_NAME_FIELD_ID];
        if (typeof name === "string" && name.trim()) {
          names[record.id] = name.trim();
        }
      }
      offset = payload.offset;
    } while (offset);
  }

  return names;
}

export type ShanghaiAgendaResult =
  | { status: "ready"; sessions: ShanghaiAgendaSession[] }
  | { status: "unavailable" };

async function fetchShanghaiAgenda(): Promise<ShanghaiAgendaSession[]> {
  const token = process.env.AIRTABLE_PAT;
  if (!token) {
    throw new Error("Shanghai agenda is not configured.");
  }

  const records: ShanghaiAgendaSourceRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({
      pageSize: "100",
      view: SHANGHAI_VIEW_ID,
      returnFieldsByFieldId: "true",
    });
    for (const fieldId of PUBLIC_SOURCE_FIELD_IDS) {
      params.append("fields[]", fieldId);
    }
    if (offset) params.set("offset", offset);

    const payload = await fetchAirtableJson<AirtableListResponse>(
      `${AIRTABLE_API_BASE}/${BASE_ID}/${encodeURIComponent(SESSIONS_TABLE_ID)}?${params}`,
      token,
      AIRTABLE_NO_STORE_OPTIONS,
      "Shanghai agenda request",
    );

    records.push(...(payload.records ?? []));
    offset = payload.offset;
  } while (offset);

  const mappingOptions = {
    ignorePublicationFlags: IGNORE_PUBLICATION_FLAGS,
  };
  const candidateSessions = mapShanghaiAgendaRecords(records, mappingOptions);
  const formatNames = await fetchFormatNames(
    records,
    new Set(candidateSessions.map((session) => session.id)),
    token,
  );

  // Cache only the narrow public mapping. Source records and private Airtable
  // fields never enter the Next.js data cache or the page response.
  return mapShanghaiAgendaRecords(records, { ...mappingOptions, formatNames });
}

const loadCachedShanghaiAgenda =
  process.env.NODE_ENV === "production"
    ? unstable_cache(
        fetchShanghaiAgenda,
        [
          "shanghai-agenda-airtable-v2",
          IGNORE_PUBLICATION_FLAGS ? "preview" : "production",
        ],
        {
          revalidate: AIRTABLE_CACHE_SECONDS,
          tags: ["shanghai-agenda"],
        },
      )
    : fetchShanghaiAgenda;

let inFlightAgendaRequest: Promise<ShanghaiAgendaSession[]> | undefined;
let localAgendaCache:
  | { expiresAt: number; sessions: ShanghaiAgendaSession[] }
  | undefined;

export async function getShanghaiAgenda(): Promise<ShanghaiAgendaResult> {
  if (
    process.env.NODE_ENV !== "production" &&
    localAgendaCache &&
    localAgendaCache.expiresAt > Date.now()
  ) {
    return { status: "ready", sessions: localAgendaCache.sessions };
  }

  if (inFlightAgendaRequest) {
    try {
      return { status: "ready", sessions: await inFlightAgendaRequest };
    } catch {
      return { status: "unavailable" };
    }
  }

  const request = loadCachedShanghaiAgenda();
  inFlightAgendaRequest = request;

  try {
    const sessions = await request;
    if (process.env.NODE_ENV !== "production") {
      localAgendaCache = {
        expiresAt: Date.now() + AIRTABLE_CACHE_SECONDS * 1000,
        sessions,
      };
    }
    return { status: "ready", sessions };
  } catch {
    // Keep upstream errors and records in server logs only; the page gets a
    // simple unavailable state and never falls back to another event's data.
    console.error("Failed to load Shanghai agenda from Airtable.");
    return { status: "unavailable" };
  } finally {
    if (inFlightAgendaRequest === request) {
      inFlightAgendaRequest = undefined;
    }
  }
}
