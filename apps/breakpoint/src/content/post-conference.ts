import type { AgendaItem } from "@/content/agenda/types";

/** The broadcast already published for the 2026 Main Stage. */
export { MAIN_STAGE_STREAM as POST_CONFERENCE_RECORDING } from "@/content/live/streams";

/** Keep the recap tied to published program data, with a mix of formats and stages. */
export function selectRecapSessions(items: AgendaItem[]): AgendaItem[] {
  const candidates = items.filter(
    (item) =>
      item.variant !== "static" &&
      /keynote|panel|fireside/i.test(item.format ?? item.tag ?? ""),
  );
  const selected: AgendaItem[] = [];
  const groups = new Set<string>();
  for (const item of candidates) {
    const group = `${item.day}/${item.location}/${item.format ?? item.tag}`;
    if (!groups.has(group)) {
      groups.add(group);
      selected.push(item);
    }
    if (selected.length === 6) return selected;
  }
  return [
    ...selected,
    ...candidates.filter((item) => !selected.includes(item)),
  ].slice(0, 6);
}
