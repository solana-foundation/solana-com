import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceZ,
} from "d3-force-3d";

// Maps below this size lay out from scratch each run, spread wider and pull
// stragglers in, so a few dozen people fill the view instead of forming a knot
// with outliers. Past it, warm starts keep a big map steady between runs.
const SMALL_MAP = 200;
// The force tuning below was set for a map this big.
const REFERENCE_COUNT = 1000;
const MAX_SPREAD = 5;

function hash(value) {
  let h = 2166136261;
  for (const c of value) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
function random(seed) {
  let x = seed >>> 0;
  return () => (x = (Math.imul(x, 1664525) + 1013904223) >>> 0) / 4294967296;
}

/** @param {{people: {id:string,handle:string}[],adds:{fromId:string,toId:string}[]}} rows @param {{positions:Record<string,[number,number,number]>}|null} previous */
export function computeLayout(rows, previous = null, options = {}) {
  const people = [...rows.people].sort((a, b) =>
    a.handle.localeCompare(b.handle),
  );
  const small = people.length < SMALL_MAP;
  if (small) previous = null;
  const spread = Math.min(
    Math.max(Math.sqrt(REFERENCE_COUNT / Math.max(people.length, 1)), 1),
    MAX_SPREAD,
  );
  const ids = new Set(people.map((p) => p.id));
  const adds = rows.adds.filter((a) => ids.has(a.fromId) && ids.has(a.toId));
  const graph = new Graph.UndirectedGraph();
  for (const p of people) graph.addNode(p.id);
  const directed = new Set(adds.map((a) => `${a.fromId}:${a.toId}`));
  for (const a of adds)
    if (!graph.hasEdge(a.fromId, a.toId) && a.fromId !== a.toId)
      graph.addUndirectedEdge(a.fromId, a.toId, {
        weight: directed.has(`${a.toId}:${a.fromId}`) ? 3 : 1,
      });
  const rng = random(2026);
  const found = people.length
    ? louvain.detailed(graph, { resolution: 1, rng }).communities
    : {};
  const community = new Map(people.map((p) => [p.id, found[p.id] ?? 0]));
  for (let pass = 0; pass < 2; pass++) {
    const sizes = new Map();
    for (const c of community.values()) sizes.set(c, (sizes.get(c) ?? 0) + 1);
    for (const p of people) {
      const c = community.get(p.id);
      if ((sizes.get(c) ?? 0) >= 25) continue;
      const votes = new Map();
      for (const n of graph.neighbors(p.id)) {
        const nc = community.get(n);
        if ((sizes.get(nc) ?? 0) >= 25) votes.set(nc, (votes.get(nc) ?? 0) + 1);
      }
      const best = [...votes].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
      if (best) community.set(p.id, best[0]);
    }
  }
  const sizes = new Map();
  for (const c of community.values()) sizes.set(c, (sizes.get(c) ?? 0) + 1);
  const ranked = [...sizes].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  const remap = new Map(ranked.map(([c], i) => [c, i]));
  for (const p of people) community.set(p.id, remap.get(community.get(p.id)));
  const largeCount = ranked.filter(([, size]) => size >= 25).length;
  const anchors = ranked.map(([, size], i) => {
    if (size < 25) return null;
    const y = 1 - (2 * (i + 0.5)) / largeCount;
    const r = Math.sqrt(1 - y * y);
    const angle = i * 2.39996;
    return [700 * r * Math.cos(angle), 700 * y, 700 * r * Math.sin(angle)];
  });
  const smallCenters = new Map();
  for (const p of people) {
    const c = community.get(p.id);
    if (anchors[c]) continue;
    for (const neighbor of graph.neighbors(p.id)) {
      const anchor = anchors[community.get(neighbor)];
      if (!anchor) continue;
      const center = smallCenters.get(c) ?? [0, 0, 0, 0];
      center[0] += anchor[0];
      center[1] += anchor[1];
      center[2] += anchor[2];
      center[3]++;
      smallCenters.set(c, center);
    }
  }
  const nodes = people.map((p) => {
    const c = community.get(p.id);
    const center = smallCenters.get(c);
    const anchor =
      anchors[c] ??
      (center
        ? [center[0] / center[3], center[1] / center[3], center[2] / center[3]]
        : [0, 0, 0]);
    const previousPosition = previous?.positions?.[p.handle];
    const jitter = random(hash(p.handle));
    const pos =
      previousPosition ?? anchor.map((v) => v + (jitter() - 0.5) * 60);
    return { id: p.id, handle: p.handle, x: pos[0], y: pos[1], z: pos[2] };
  });
  const links = [];
  for (const edge of graph.edges()) {
    const [a, b] = graph.extremities(edge);
    const mutual = directed.has(`${a}:${b}`) && directed.has(`${b}:${a}`);
    const same = community.get(a) === community.get(b);
    links.push({
      source: a,
      target: b,
      distance: mutual ? 10 : same ? 40 : 140,
      strength: mutual ? 0.9 : same ? 0.15 : 0.015,
    });
  }
  const targets = new Map();
  for (const a of adds) {
    const list = targets.get(a.fromId) ?? [];
    list.push(a.toId);
    targets.set(a.fromId, list);
  }
  const groups = new Map();
  for (const [id, list] of targets) {
    list.sort();
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const key = `${list[i]}:${list[j]}`;
        const group = groups.get(key) ?? [];
        group.push(id);
        groups.set(key, group);
      }
  }
  for (const group of groups.values()) {
    group.sort();
    for (let i = 0; i < Math.min(group.length, 40); i++)
      if (group.length > 1)
        links.push({
          source: group[i],
          target: group[(i + 1) % Math.min(group.length, 40)],
          distance: 25,
          strength: 0.08,
        });
  }
  const centroidForce = (alpha) => {
    const centers = new Map();
    for (const n of nodes) {
      const c = community.get(n.id);
      let x = centers.get(c);
      if (!x) {
        x = [0, 0, 0, 0];
        centers.set(c, x);
      }
      x[0] += n.x;
      x[1] += n.y;
      x[2] += n.z;
      x[3]++;
    }
    for (const n of nodes) {
      const c = centers.get(community.get(n.id));
      n.vx += (c[0] / c[3] - n.x) * 0.22 * alpha;
      n.vy += (c[1] / c[3] - n.y) * 0.22 * alpha;
      n.vz += (c[2] / c[3] - n.z) * 0.22 * alpha;
    }
  };
  const simulation = forceSimulation(nodes, 3)
    .force(
      "link",
      forceLink(links)
        .id((n) => n.id)
        .distance((l) => l.distance)
        .strength((l) => l.strength),
    )
    .force(
      "charge",
      forceManyBody()
        .strength(-22 * spread)
        .theta(0.9)
        .distanceMax(400),
    )
    .force("center", forceCenter())
    .force("community", centroidForce)
    .stop();
  if (small)
    for (const axis of ["x", "y", "z"])
      simulation.force(
        axis,
        (axis === "x" ? forceX : axis === "y" ? forceY : forceZ)(0).strength(
          0.08,
        ),
      );
  if (previous) simulation.alpha(0.15);
  const ticks = options.ticks ?? (previous ? 40 : 200);
  for (let i = 0; i < ticks; i++) simulation.tick();
  const positions = Object.fromEntries(
    nodes.map((n) => [n.handle, [n.x, n.y, n.z]]),
  );
  const communitiesByHandle = Object.fromEntries(
    people.map((p) => [p.handle, community.get(p.id)]),
  );
  const inbound = new Map();
  for (const a of adds) inbound.set(a.toId, (inbound.get(a.toId) ?? 0) + 1);
  const communities = ranked.map(([, size], id) => ({
    id,
    size,
    label: "@unknown",
  }));
  const bestDegree = new Map();
  for (const person of people) {
    const id = community.get(person.id);
    const degree = inbound.get(person.id) ?? 0;
    if (!bestDegree.has(id) || degree > bestDegree.get(id)) {
      communities[id].label = person.handle;
      bestDegree.set(id, degree);
    }
  }
  return { positions, community: communitiesByHandle, communities };
}
