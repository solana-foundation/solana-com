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
  type ShanghaiAgendaSession,
  type ShanghaiAgendaSourceRecord,
} from "./shanghai-agenda-mapper";

const BASE_ID = "applsN0LSl2rps6le";
const SESSIONS_TABLE_ID = "tblhmC8GAuTrrebqA";
const SHANGHAI_VIEW_ID = "viwRCpQEfJqc2C2ci";
const AIRTABLE_CACHE_SECONDS = 60;
const AIRTABLE_NO_STORE_OPTIONS: AirtableFetchOptions = { cache: "no-store" };
const PUBLIC_SOURCE_FIELD_IDS = Object.values(SHANGHAI_AGENDA_FIELD_IDS);

type AirtableListResponse = {
  records?: ShanghaiAgendaSourceRecord[];
  offset?: string;
};

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

  // Cache only the narrow public mapping. Source records and private Airtable
  // fields never enter the Next.js data cache or the page response.
  return mapShanghaiAgendaRecords(records);
}

const loadCachedShanghaiAgenda =
  process.env.NODE_ENV === "production"
    ? unstable_cache(fetchShanghaiAgenda, ["shanghai-agenda-airtable-v1"], {
        revalidate: AIRTABLE_CACHE_SECONDS,
        tags: ["shanghai-agenda"],
      })
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
