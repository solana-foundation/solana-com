import { describe, expect, it } from "vitest";
import { normalizeHandle, validateAdds } from "@/lib/here-for/handles";
import { buildGraph, type GraphRows } from "@/lib/here-for/graph";
import { suggestionsFor } from "@/lib/here-for/suggestions";
import { graphPayload } from "@/lib/here-for/payload";
import { layoutGraph } from "@/lib/here-for/layout";
const people = ["@alice", "@bob", "@cara", "@dave", "@eve", "@fran"].map(
  (handle, i) => ({
    id: String(i),
    handle: handle as `@${string}`,
    claimedById: null,
  }),
);
const adds = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 0],
  [1, 4],
  [2, 4],
  [4, 2],
  [5, 0],
  [5, 4],
].map(([from, to], i) => ({
  fromId: String(from),
  toId: String(to),
  rank: (i % 3) + 1,
}));
const rows: GraphRows = { people, adds };
describe("here-for graph", () => {
  it("normalizes and validates handles", () => {
    expect(normalizeHandle("  @@AlIce_1 ")).toBe("@alice_1");
    expect(normalizeHandle("bad-name")).toBeNull();
    expect(validateAdds("@alice", ["bob", "cara", "@alice"])).toEqual({
      code: "self_add",
    });
    expect(validateAdds("@alice", ["bob", "@bob", "cara"])).toEqual({
      code: "invalid_adds",
    });
  });
  it("detects mutual adds and degree", () => {
    const graph = buildGraph(rows);
    expect(graph.isMutual("0", "1")).toBe(true);
    expect(graph.isMutual("0", "2")).toBe(false);
    expect(graph.inDegree("0")).toBe(2);
    expect(graph.bfs("0").get("4")).toBe(2);
  });
  it("scores reasons and excludes current adds", () => {
    const suggestions = suggestionsFor(rows, "@alice");
    expect(suggestions.some((s) => s.handle === "@bob")).toBe(false);
    expect(suggestions[0]?.handle).toBe("@eve");
    expect(suggestions[0]?.score).toBeGreaterThan(0);
    expect(
      suggestions.find((s) => s.handle === "@fran")?.reasons,
    ).toContainEqual({ kind: "addedYou" });
  });
  it("places unsnapshotted neighbors near known positions", () => {
    const payload = graphPayload(rows, {
      id: "snap",
      createdAt: new Date(0),
      payload: {
        positions: { "@alice": [100, 200, 300] },
        community: { "@alice": 0 },
        communities: [{ id: 0, size: 1, label: "@alice" }],
      },
    });
    const i = payload.handles.indexOf("@bob");
    expect(payload.positions[i * 3]).toBeGreaterThan(90);
    expect(payload.positions[i * 3 + 1]).toBeGreaterThan(190);
    expect(payload.positions[i * 3 + 2]).toBeGreaterThan(290);
  });
  it("does not expose a hidden snapshot label", () => {
    const visible = {
      people: rows.people.filter((p) => p.handle !== "@alice"),
      adds: rows.adds.filter((a) => a.fromId !== "0" && a.toId !== "0"),
    };
    const payload = graphPayload(visible, {
      id: "snap",
      createdAt: new Date(0),
      payload: {
        positions: {},
        community: Object.fromEntries(rows.people.map((p) => [p.handle, 0])),
        communities: [{ id: 0, size: 6, label: "@alice" }],
      },
    });
    expect(payload.handles).not.toContain("@alice");
    expect(payload.communities[0]?.label).not.toBe("@alice");
  });
  it("counts sparse communities, removes empty ones, and breaks label ties by handle", () => {
    const payload = graphPayload(rows, {
      id: "snap",
      createdAt: new Date(0),
      payload: {
        positions: {},
        community: {
          "@alice": 7,
          "@bob": 7,
          "@cara": 7,
          "@dave": 9,
          "@eve": 9,
          "@fran": 9,
        },
        communities: [
          { id: 7, size: 99, label: "@hidden" },
          { id: 8, size: 99, label: "@hidden" },
          { id: 9, size: 99, label: "@hidden" },
        ],
      },
    });
    expect(payload.communities).toEqual([
      { id: 0, size: 3, label: "@alice" },
      { id: 1, size: 3, label: "@eve" },
    ]);
    expect(payload.community).toEqual([0, 0, 0, 1, 1, 1]);
  });
  it("uses deterministic layout and keeps mutual pairs closer", () => {
    const first = layoutGraph(rows, null, { ticks: 35 });
    const second = layoutGraph(rows, null, { ticks: 35 });
    expect(first.positions).toEqual(second.positions);
    const distance = (a: string, b: string) =>
      Math.hypot(
        ...first.positions[a]!.map((x, i) => x - first.positions[b]![i]!),
      );
    expect(distance("@alice", "@bob")).toBeLessThan(distance("@alice", "@eve"));
  });
  it("keeps small communities without spreading their starts across the sphere", () => {
    const layout = layoutGraph(rows, null, { ticks: 0 });
    expect(new Set(Object.values(layout.community)).size).toBeGreaterThan(1);
    for (const position of Object.values(layout.positions))
      expect(Math.max(...position.map(Math.abs))).toBeLessThan(31);
  });
});
