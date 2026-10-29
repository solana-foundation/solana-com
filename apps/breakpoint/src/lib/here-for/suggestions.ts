import { buildGraph, type GraphRows } from "./graph";
import type {
  HereForHandle,
  HereForSuggestion,
  HereForSuggestionReason,
} from "./types";

export function suggestionsFor(
  rows: GraphRows,
  handle: HereForHandle,
  graph = buildGraph(rows),
): HereForSuggestion[] {
  const me = graph.byHandle.get(handle);
  if (!me) return [];
  const mine = new Set((graph.outgoing.get(me.id) ?? []).map((a) => a.toId));
  const scored = new Map<
    string,
    {
      score: number;
      reasons: { weight: number; reason: HereForSuggestionReason }[];
    }
  >();
  const add = (id: string, weight: number, reason: HereForSuggestionReason) => {
    if (id === me.id || mine.has(id)) return;
    const entry = scored.get(id) ?? { score: 0, reasons: [] };
    entry.score += weight;
    entry.reasons.push({ weight, reason });
    scored.set(id, entry);
  };
  for (const a of graph.incoming.get(me.id) ?? [])
    add(a.fromId, 5, { kind: "addedYou" });
  // Walk the reverse index of your adds instead of scanning every person.
  for (const id of mine)
    for (const a of graph.incoming.get(id) ?? [])
      add(a.fromId, 2, {
        kind: "sharedAdd",
        via: graph.byId.get(id)!.handle,
      });
  for (const id of mine)
    for (const a of graph.outgoing.get(id) ?? [])
      add(a.toId, 2, { kind: "yourAddAdded", via: graph.byId.get(id)!.handle });
  for (const a of graph.incoming.get(me.id) ?? [])
    for (const other of graph.outgoing.get(a.fromId) ?? [])
      add(other.toId, 1, {
        kind: "coAdded",
        via: graph.byId.get(a.fromId)!.handle,
      });
  return [...scored]
    .map(([id, entry]) => ({
      handle: graph.byId.get(id)!.handle,
      claimed: Boolean(graph.byId.get(id)!.claimedAt),
      score: entry.score,
      reasons: entry.reasons
        .sort(
          (a, b) =>
            b.weight - a.weight ||
            JSON.stringify(a.reason).localeCompare(JSON.stringify(b.reason)),
        )
        .slice(0, 3)
        .map((item) => item.reason),
    }))
    .sort((a, b) => b.score - a.score || a.handle.localeCompare(b.handle))
    .slice(0, 25);
}
