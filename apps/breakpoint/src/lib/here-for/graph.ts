import type { HereForHandle } from "./types";

export type PersonRow = {
  id: string;
  handle: HereForHandle;
  claimedAt: Date | null;
};
export type AddRow = { fromId: string; toId: string; rank: number };
export type GraphRows = { people: PersonRow[]; adds: AddRow[] };

export function buildGraph(rows: GraphRows) {
  const byId = new Map(rows.people.map((person) => [person.id, person]));
  const byHandle = new Map(
    rows.people.map((person) => [person.handle, person]),
  );
  const outgoing = new Map<string, AddRow[]>();
  const incoming = new Map<string, AddRow[]>();
  const edgeSet = new Set<string>();
  for (const add of rows.adds) {
    if (!byId.has(add.fromId) || !byId.has(add.toId)) continue;
    (
      outgoing.get(add.fromId) ??
      (outgoing.set(add.fromId, []), outgoing.get(add.fromId)!)
    ).push(add);
    (
      incoming.get(add.toId) ??
      (incoming.set(add.toId, []), incoming.get(add.toId)!)
    ).push(add);
    edgeSet.add(`${add.fromId}:${add.toId}`);
  }
  const isMutual = (a: string, b: string) =>
    edgeSet.has(`${a}:${b}`) && edgeSet.has(`${b}:${a}`);
  const inDegree = (id: string) => incoming.get(id)?.length ?? 0;
  const neighbors = (id: string) =>
    new Set([
      ...(outgoing.get(id) ?? []).map((a) => a.toId),
      ...(incoming.get(id) ?? []).map((a) => a.fromId),
    ]);
  const bfs = (start: string, maxDepth = Infinity) => {
    const distance = new Map([[start, 0]]);
    const queue = [start];
    for (let i = 0; i < queue.length; i++) {
      const id = queue[i]!;
      const next = distance.get(id)! + 1;
      if (next > maxDepth) continue;
      for (const neighbor of neighbors(id))
        if (!distance.has(neighbor)) {
          distance.set(neighbor, next);
          queue.push(neighbor);
        }
    }
    return distance;
  };
  return {
    byId,
    byHandle,
    outgoing,
    incoming,
    edgeSet,
    isMutual,
    inDegree,
    neighbors,
    bfs,
  };
}
