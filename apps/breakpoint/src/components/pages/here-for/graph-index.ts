import type {
  HereForGraphPayload,
  HereForHandle,
  HereForMePayload,
} from "@/lib/here-for/types";

export type HereForView =
  | "all"
  | "mutuals"
  | "network"
  | "most"
  | "communities";

export const HERE_FOR_VIEWS: HereForView[] = [
  "all",
  "mutuals",
  "network",
  "most",
  "communities",
];

/**
 * Client-side index over the graph payload. Everything the explorer panel
 * shows (their 3, who added them, mutuals, path from you) is derived here, so
 * selecting a node never waits on the network.
 */
export type GraphIndex = {
  payload: HereForGraphPayload;
  size: number;
  byHandle: Map<HereForHandle, number>;
  outs: number[][];
  ins: number[][];
  undirected: number[][];
  /** Pair key `${min}:${max}` for every mutual pair. */
  mutualPairs: Set<string>;
  linkMutual: Uint8Array;
  mutualCount: number;
  ranked: number[];
};

const pairKey = (a: number, b: number) => (a < b ? `${a}:${b}` : `${b}:${a}`);

/** Matches the layout's same-community link distance. */
const NEW_TARGET_RADIUS = 40;

export function buildGraphIndex(payload: HereForGraphPayload): GraphIndex {
  const size = payload.handles.length;
  const outs: number[][] = Array.from({ length: size }, () => []);
  const ins: number[][] = Array.from({ length: size }, () => []);
  const undirected: number[][] = Array.from({ length: size }, () => []);
  const directed = new Set<string>();

  for (let i = 0; i < payload.links.length; i += 2) {
    const from = payload.links[i]!;
    const to = payload.links[i + 1]!;
    outs[from]!.push(to);
    ins[to]!.push(from);
    directed.add(`${from}>${to}`);
  }

  const mutualPairs = new Set<string>();
  const linkMutual = new Uint8Array(payload.links.length / 2);
  for (let i = 0; i < linkMutual.length; i++) {
    const from = payload.links[i * 2]!;
    const to = payload.links[i * 2 + 1]!;
    if (directed.has(`${to}>${from}`)) {
      linkMutual[i] = 1;
      mutualPairs.add(pairKey(from, to));
    }
  }
  const seen = new Set<string>();
  for (let from = 0; from < size; from++) {
    for (const to of outs[from]!) {
      const key = pairKey(from, to);
      if (seen.has(key)) continue;
      seen.add(key);
      undirected[from]!.push(to);
      undirected[to]!.push(from);
    }
  }

  const byHandle = new Map<HereForHandle, number>();
  payload.handles.forEach((handle, index) => byHandle.set(handle, index));

  const ranked = Array.from({ length: size }, (_, i) => i).sort(
    (a, b) => (payload.inDegree[b] ?? 0) - (payload.inDegree[a] ?? 0),
  );

  return {
    payload,
    size,
    byHandle,
    outs,
    ins,
    undirected,
    mutualPairs,
    linkMutual,
    mutualCount: mutualPairs.size,
    ranked,
  };
}

export function isMutual(index: GraphIndex, a: number, b: number) {
  return index.mutualPairs.has(pairKey(a, b));
}

/** Shortest undirected path between two people, inclusive, or [] if none. */
export function shortestPath(index: GraphIndex, from: number, to: number) {
  if (from === to) return [from];
  const previous = new Int32Array(index.size).fill(-2);
  previous[from] = -1;
  const queue = [from];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head]!;
    for (const next of index.undirected[node]!) {
      if (previous[next] !== -2) continue;
      previous[next] = node;
      if (next === to) {
        const path = [to];
        let step = node;
        while (step !== -1) {
          path.unshift(step);
          step = previous[step]!;
        }
        return path;
      }
      queue.push(next);
    }
  }
  return [];
}

/** Everyone within `depth` undirected steps of `from`. */
export function neighbourhood(index: GraphIndex, from: number, depth = 2) {
  const reached = new Set<number>([from]);
  let frontier = [from];
  for (let level = 0; level < depth; level++) {
    const next: number[] = [];
    for (const node of frontier) {
      for (const neighbour of index.undirected[node]!) {
        if (reached.has(neighbour)) continue;
        reached.add(neighbour);
        next.push(neighbour);
      }
    }
    frontier = next;
  }
  return reached;
}

export function searchHandles(index: GraphIndex, query: string, limit = 6) {
  const needle = query.trim().replace(/^@+/, "").toLowerCase();
  if (!needle) return [];
  const starts: number[] = [];
  const contains: number[] = [];
  for (const node of index.ranked) {
    const handle = index.payload.handles[node]!.slice(1);
    if (handle.startsWith(needle)) starts.push(node);
    else if (handle.includes(needle)) contains.push(node);
    if (starts.length >= limit) break;
  }
  return starts.concat(contains).slice(0, limit);
}

/**
 * Overlays the visitor's own saved adds onto a graph payload. The graph is
 * CDN-cached for up to a minute, but someone who just saved their 3 should
 * see themselves immediately, so `/me` (never cached) wins for that one node.
 */
export function withMe(
  payload: HereForGraphPayload,
  me: Pick<HereForMePayload, "handle" | "adds"> | null,
): HereForGraphPayload {
  if (!me?.handle || me.adds.length === 0) return payload;
  const selfIndex = payload.handles.indexOf(me.handle);
  if (selfIndex !== -1 && payload.claimed[selfIndex] === 1) {
    const saved: number[] = [];
    for (let i = 0; i < payload.links.length; i += 2)
      if (payload.links[i] === selfIndex) saved.push(payload.links[i + 1]!);
    if (
      saved.length === me.adds.length &&
      saved.every((node, i) => payload.handles[node] === me.adds[i])
    )
      return payload;
  }
  const next: HereForGraphPayload = {
    ...payload,
    handles: [...payload.handles],
    claimed: [...payload.claimed],
    positions: [...payload.positions],
    community: [...payload.community],
    inDegree: [...payload.inDegree],
    links: [],
  };
  const lookup = new Map(next.handles.map((handle, i) => [handle, i]));
  const ensure = (
    handle: HereForHandle,
    position: number[],
    community: number,
  ) => {
    const existing = lookup.get(handle);
    if (existing !== undefined) return existing;
    const node = next.handles.length;
    next.handles.push(handle);
    next.claimed.push(0);
    next.positions.push(position[0]!, position[1]!, position[2]!);
    next.community.push(community);
    next.inDegree.push(0);
    lookup.set(handle, node);
    return node;
  };

  // Place the visitor first so people the cached layout has not seen yet can
  // fan out around them instead of all landing on the same point.
  const knownSelf = lookup.get(me.handle);
  const knownTargets = me.adds
    .map((handle) => lookup.get(handle))
    .filter((n): n is number => n !== undefined);
  const selfPosition =
    knownSelf !== undefined
      ? next.positions.slice(knownSelf * 3, knownSelf * 3 + 3)
      : [0, 1, 2].map(
          (axis) =>
            (knownTargets.length
              ? knownTargets.reduce(
                  (sum, n) => sum + next.positions[n * 3 + axis]!,
                  0,
                ) / knownTargets.length
              : 0) + (axis < 2 ? 12 : 0),
        );
  const selfCommunity =
    knownSelf !== undefined
      ? next.community[knownSelf]!
      : knownTargets[0] !== undefined
        ? next.community[knownTargets[0]]!
        : 0;

  const targets = me.adds.map((handle, i) => {
    const angle = (2 * Math.PI * i) / me.adds.length;
    return ensure(
      handle,
      [
        selfPosition[0]! + Math.cos(angle) * NEW_TARGET_RADIUS,
        selfPosition[1]! + Math.sin(angle) * NEW_TARGET_RADIUS,
        selfPosition[2]! + (i % 2 ? -1 : 1) * NEW_TARGET_RADIUS * 0.25,
      ],
      selfCommunity,
    );
  });
  const self = ensure(me.handle, selfPosition, selfCommunity);
  next.claimed[self] = 1;
  for (let i = 0; i < payload.links.length; i += 2) {
    const from = payload.links[i]!;
    const to = payload.links[i + 1]!;
    if (from === self) next.inDegree[to] = Math.max(0, next.inDegree[to]! - 1);
    else next.links.push(from, to);
  }
  for (const to of targets) {
    next.links.push(self, to);
    next.inDegree[to] = next.inDegree[to]! + 1;
  }
  return next;
}
