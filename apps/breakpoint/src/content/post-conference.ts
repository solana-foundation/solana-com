import type { AgendaItem } from "@/content/agenda/types";

/** The broadcast already published for the 2026 Main Stage. */
export { MAIN_STAGE_STREAM as POST_CONFERENCE_RECORDING } from "@/content/live/streams";

const RECAP_SESSION_COUNT = 6;

/**
 * Sessions the home page recap leads with, by Airtable record id, in display
 * order. Each has a published recording. A session that is no longer in the
 * published agenda is skipped and the remaining slots fall back to the mix
 * of formats and stages below.
 */
export const FEATURED_RECAP_SESSION_IDS: readonly string[] = [
  // Welcome to Breakpoint 2026 (Solana Foundation)
  "rec9W1l5bhcmxpus5",
  // Debate: Crypto Is Key to the UK's Economic Future (Boris Johnson)
  "recCoxyafB3fphlRt",
  // The Former White House Crypto Chief on the Future of Digital Assets
  "recmx45FQn4Lrq2WW",
  // Rewiring the Market (DTCC, Barclays)
  "recuewGA1IJsuoNuR",
  // The City Goes Onchain (London Stock Exchange, xStocks)
  "recMMsoetHgrOYypP",
  // The Future of Money Is Choice (Mastercard)
  "recLO8Gxk1bTXSJXC",
];

/**
 * The featured sessions first, then published program data with a mix of
 * formats and stages for any slot a featured session leaves empty.
 */
export function selectRecapSessions(items: AgendaItem[]): AgendaItem[] {
  const featured = FEATURED_RECAP_SESSION_IDS.flatMap((id) => {
    const item = items.find(
      (candidate) => candidate.id === id && candidate.variant !== "static",
    );
    return item ? [item] : [];
  }).slice(0, RECAP_SESSION_COUNT);
  if (featured.length === RECAP_SESSION_COUNT) return featured;

  const candidates = items.filter(
    (item) =>
      item.variant !== "static" &&
      !featured.includes(item) &&
      /keynote|panel|fireside/i.test(item.format ?? item.tag ?? ""),
  );
  const selected: AgendaItem[] = [...featured];
  const groups = new Set<string>();
  for (const item of candidates) {
    const group = `${item.day}/${item.location}/${item.format ?? item.tag}`;
    if (!groups.has(group)) {
      groups.add(group);
      selected.push(item);
    }
    if (selected.length === RECAP_SESSION_COUNT) return selected;
  }
  return [
    ...selected,
    ...candidates.filter((item) => !selected.includes(item)),
  ].slice(0, RECAP_SESSION_COUNT);
}
