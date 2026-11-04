import "server-only";

import { getAirtableAgenda } from "@/content/agenda/airtable";
import { fallbackAgenda } from "@/content/agenda/fallback-agenda";
import type { AgendaItem } from "@/content/agenda/types";

/**
 * Airtable is the only source of published sessions. The placeholder agenda
 * keeps the live layout working without credentials and never ships.
 */
export async function getLiveAgenda(): Promise<AgendaItem[]> {
  const agenda = await getAirtableAgenda();
  if (agenda) return agenda;
  return process.env.NODE_ENV === "production" ? [] : fallbackAgenda;
}

export type LiveSessionsPayload = {
  items: AgendaItem[];
  /** Server clock at response time, so clients can correct their own. */
  now: number;
};
