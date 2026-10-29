import { buildGraph, type GraphRows } from "./graph";
import type { LayoutSnapshot } from "./data";
import type {
  HereForGraphPayload,
  HereForHandle,
  HereForMePayload,
  HereForPersonPayload,
} from "./types";
import { suggestionsFor } from "./suggestions";

function jitter(handle: string) {
  let h = 2166136261;
  for (const c of handle) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return [
    (((h >>> 0) % 1000) / 1000 - 0.5) * 20,
    (((h >>> 10) % 1000) / 1000 - 0.5) * 20,
    (((h >>> 20) % 1000) / 1000 - 0.5) * 20,
  ];
}
const round = (n: number) => Math.round(n * 10) / 10;

export function graphPayload(
  rows: GraphRows,
  snapshot: LayoutSnapshot | null,
): HereForGraphPayload {
  const graph = buildGraph(rows);
  const people = [...rows.people].sort((a, b) =>
    a.handle.localeCompare(b.handle),
  );
  const index = new Map(people.map((p, i) => [p.id, i]));
  const positions: number[] = [];
  const community: number[] = [];
  const known = snapshot?.payload.positions ?? {};
  const communities =
    snapshot?.payload.communities.map((c) => ({ ...c })) ?? [];
  for (const p of people) {
    let pos = known[p.handle];
    if (!pos) {
      const nearby = [...graph.neighbors(p.id)]
        .map((id) => known[graph.byId.get(id)!.handle])
        .filter((x): x is [number, number, number] => Boolean(x));
      const center = nearby.length
        ? [0, 1, 2].map(
            (i) => nearby.reduce((sum, x) => sum + x[i]!, 0) / nearby.length,
          )
        : [0, 0, 0];
      const noise = jitter(p.handle);
      pos = [
        center[0]! + noise[0]!,
        center[1]! + noise[1]!,
        center[2]! + noise[2]!,
      ];
    }
    positions.push(...pos.map(round));
    let c = snapshot?.payload.community[p.handle];
    if (c === undefined) {
      const adjacent = [...graph.neighbors(p.id)]
        .map((id) => snapshot?.payload.community[graph.byId.get(id)!.handle])
        .find((x) => x !== undefined);
      c = adjacent ?? 0;
    }
    community.push(c);
  }
  if (people.length && !communities.length)
    communities.push({ id: 0, size: 0, label: people[0]!.handle });
  // Count members and choose visible labels in one pass, including when the
  // layout has many small disconnected communities.
  const summaries = new Map<
    number,
    { size: number; label: (typeof people)[number] }
  >();
  for (let i = 0; i < people.length; i++) {
    const person = people[i]!;
    const id = community[i]!;
    const summary = summaries.get(id);
    if (!summary) summaries.set(id, { size: 1, label: person });
    else {
      summary.size++;
      if (graph.inDegree(person.id) > graph.inDegree(summary.label.id))
        summary.label = person;
    }
  }
  // People are already sorted by handle, so equal degrees keep that ordering.
  for (const c of communities) {
    const summary = summaries.get(c.id);
    c.size = summary?.size ?? 0;
    if (summary) c.label = summary.label.handle;
  }
  const visibleCommunities = communities.filter((c) => c.size > 0);
  const communityIds = new Map(visibleCommunities.map((c, i) => [c.id, i]));
  for (const c of visibleCommunities) c.id = communityIds.get(c.id)!;
  for (let i = 0; i < community.length; i++)
    community[i] = communityIds.get(community[i]!) ?? 0;
  const links = rows.adds.flatMap((a) => {
    const from = index.get(a.fromId),
      to = index.get(a.toId);
    return from === undefined || to === undefined ? [] : [from, to];
  });
  return {
    version: snapshot?.id ?? "pending",
    generatedAt: snapshot?.createdAt.toISOString() ?? new Date(0).toISOString(),
    handles: people.map((p) => p.handle),
    claimed: people.map((p) => (p.claimedById ? 1 : 0)),
    positions,
    community,
    communities: visibleCommunities,
    links,
    inDegree: people.map((p) => graph.inDegree(p.id)),
  };
}

export function personPayload(
  rows: GraphRows,
  handle: HereForHandle,
  graph = buildGraph(rows),
): HereForPersonPayload | null {
  const person = graph.byHandle.get(handle);
  if (!person) return null;
  const adds = (graph.outgoing.get(person.id) ?? [])
    .sort((a, b) => a.rank - b.rank)
    .map((a) => ({
      handle: graph.byId.get(a.toId)!.handle,
      rank: a.rank,
      mutual: graph.isMutual(person.id, a.toId),
    }));
  const addedBy = (graph.incoming.get(person.id) ?? [])
    .map((a) => ({
      handle: graph.byId.get(a.fromId)!.handle,
      mutual: graph.isMutual(person.id, a.fromId),
    }))
    .sort((a, b) => a.handle.localeCompare(b.handle));
  return {
    handle,
    claimed: Boolean(person.claimedById),
    adds,
    addedBy,
    mutualCount: adds.filter((a) => a.mutual).length,
  };
}

export function mePayload(
  rows: GraphRows,
  handle: HereForHandle | null,
  status: "open" | "closed",
  xHandle: HereForHandle | null = null,
): HereForMePayload {
  const graph = handle ? buildGraph(rows) : null;
  const person = handle ? personPayload(rows, handle, graph!) : null;
  return {
    handle: person?.handle ?? null,
    xHandle,
    adds: person?.adds.map((a) => a.handle) ?? [],
    mutuals: person?.adds.filter((a) => a.mutual).map((a) => a.handle) ?? [],
    addedBy: person?.addedBy.map((a) => a.handle) ?? [],
    suggestions: person ? suggestionsFor(rows, person.handle, graph!) : [],
    status,
  };
}

export function hereForStatus(now = new Date()): "open" | "closed" {
  const value = process.env.HERE_FOR_CLOSES_AT;
  if (!value) return "open";
  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    throw new Error("HERE_FOR_CLOSES_AT must be an ISO date");
  return now >= date ? "closed" : "open";
}
