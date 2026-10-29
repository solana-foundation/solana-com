import { handleFromInput } from "@/lib/here-for/handles";
import type {
  HereForDirectoryPayload,
  HereForHandle,
} from "@/lib/here-for/types";
import type { GraphIndex } from "./graph-index";

export type Candidate = {
  handle: HereForHandle;
  name: string | null;
  /** People on the map who added them; null when they're not on the map. */
  addedBy: number | null;
  /** Lowercase, accent-free name for matching. */
  key: string;
};

const fold = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Everyone worth suggesting: people on the map, most added first, then the
 * seeded directory in follower order. Directory names fill in for both.
 */
export function buildCandidates(
  graph: GraphIndex | null,
  directory: HereForDirectoryPayload | null,
): Candidate[] {
  const names = new Map<string, string>(
    directory?.entries.map(([handle, name]) => [`@${handle}`, name]) ?? [],
  );
  const out = new Map<HereForHandle, Candidate>();
  const add = (handle: HereForHandle, addedBy: number | null) => {
    if (out.has(handle)) return;
    const name = names.get(handle) || null;
    out.set(handle, { handle, name, addedBy, key: fold(name ?? "") });
  };
  if (graph)
    for (const node of graph.ranked)
      add(graph.payload.handles[node]!, graph.payload.inDegree[node] ?? 0);
  for (const [handle] of directory?.entries ?? []) add(`@${handle}`, null);
  return [...out.values()];
}

/**
 * Ranks an exact handle, then handle prefixes, then name word prefixes ("ana" finds Anatoly), then
 * handle substrings. Within each tier candidates keep their popularity order.
 * A valid handle nobody knows yet is offered last, so anyone can be added,
 * or first when typed with "@".
 */
export function matchCandidates(
  candidates: Candidate[],
  draft: string,
  taken: ReadonlySet<string>,
  limit: number,
): Candidate[] {
  const query = fold(draft.trim().replace(/^@+/, ""));
  if (!query || query.includes("/")) return [];
  const tiers: Candidate[][] = [[], [], [], []];
  for (const c of candidates) {
    if (taken.has(c.handle)) continue;
    const at = c.handle.indexOf(query, 1);
    const tier =
      c.handle.length === query.length + 1 && at === 1
        ? 0
        : at === 1
          ? 1
          : c.key.startsWith(query) || c.key.includes(` ${query}`)
            ? 2
            : at > 1
              ? 3
              : -1;
    if (tier >= 0 && tiers[tier]!.length < limit) tiers[tier]!.push(c);
  }
  const out = tiers.flat().slice(0, limit);
  const typed = handleFromInput(draft);
  // "@raj" names an exact account, so it leads even when others share a prefix.
  if (
    typed &&
    draft.trim().startsWith("@") &&
    !taken.has(typed) &&
    out[0]?.handle !== typed
  )
    return [
      out.find((c) => c.handle === typed) ?? {
        handle: typed,
        name: null,
        addedBy: null,
        key: "",
      },
      ...out.filter((c) => c.handle !== typed),
    ].slice(0, limit);
  if (typed && !taken.has(typed) && !out.some((c) => c.handle === typed))
    return [
      ...out.slice(0, limit - 1),
      { handle: typed, name: null, addedBy: null, key: "" },
    ];
  return out;
}
