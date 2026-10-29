import { describe, expect, it } from "vitest";
import type { HereForGraphPayload } from "@/lib/here-for/types";
import {
  buildGraphIndex,
  isMutual,
  neighbourhood,
  searchHandles,
  shortestPath,
  withMe,
} from "@/components/pages/here-for/graph-index";

// 0 ⇄ 1, 1 → 2, 2 → 3, 4 → 2, 5 isolated (added nobody, added by nobody).
function payload(): HereForGraphPayload {
  const handles = ["@ana", "@rob", "@mira", "@kat", "@sam", "@lone"] as const;
  return {
    version: "test",
    generatedAt: new Date(0).toISOString(),
    handles: [...handles],
    claimed: [1, 1, 1, 0, 1, 0],
    positions: handles.flatMap((_, i) => [i, i, i]),
    community: [0, 0, 1, 1, 1, 0],
    communities: [
      { id: 0, size: 3, label: "@ana" },
      { id: 1, size: 3, label: "@mira" },
    ],
    links: [0, 1, 1, 0, 1, 2, 2, 3, 4, 2],
    inDegree: [1, 1, 2, 1, 0, 0],
  };
}

describe("here-for graph index", () => {
  const index = buildGraphIndex(payload());

  it("indexes adds in both directions", () => {
    expect(index.outs[1]).toEqual([0, 2]);
    expect(index.ins[2]).toEqual([1, 4]);
    expect(index.byHandle.get("@mira")).toBe(2);
  });

  it("detects mutual pairs once", () => {
    expect(isMutual(index, 0, 1)).toBe(true);
    expect(isMutual(index, 1, 0)).toBe(true);
    expect(isMutual(index, 1, 2)).toBe(false);
    expect(index.mutualCount).toBe(1);
    expect([...index.linkMutual]).toEqual([1, 1, 0, 0, 0]);
  });

  it("ranks people by how often they were added", () => {
    expect(index.ranked[0]).toBe(2);
  });

  it("finds the shortest undirected path", () => {
    expect(shortestPath(index, 0, 3)).toEqual([0, 1, 2, 3]);
    expect(shortestPath(index, 4, 0)).toEqual([4, 2, 1, 0]);
    expect(shortestPath(index, 2, 2)).toEqual([2]);
    expect(shortestPath(index, 0, 5)).toEqual([]);
  });

  it("collects everyone within two steps", () => {
    expect([...neighbourhood(index, 0, 2)].sort()).toEqual([0, 1, 2]);
    expect([...neighbourhood(index, 2, 1)].sort()).toEqual([1, 2, 3, 4]);
  });

  it("searches handles by prefix before substring", () => {
    expect(searchHandles(index, "@mi")).toEqual([2]);
    expect(searchHandles(index, "m")).toEqual([2, 4]);
    expect(searchHandles(index, "a")[0]).toBe(0);
    expect(searchHandles(index, "  ")).toEqual([]);
  });
});

describe("withMe overlay", () => {
  it("replaces a stale node's adds with the visitor's saved adds", () => {
    const merged = withMe(payload(), {
      handle: "@kat",
      adds: ["@ana", "@rob", "@new"],
    });
    const index = buildGraphIndex(merged);
    const kat = index.byHandle.get("@kat")!;
    expect(merged.claimed[kat]).toBe(1);
    expect(index.outs[kat]!.map((n) => merged.handles[n])).toEqual([
      "@ana",
      "@rob",
      "@new",
    ]);
    expect(merged.inDegree[index.byHandle.get("@new")!]).toBe(1);
    expect(merged.links.length).toBe(payload().links.length + 6);
  });

  it("adds a brand new visitor next to the people they added", () => {
    const merged = withMe(payload(), {
      handle: "@fresh",
      adds: ["@ana", "@rob", "@mira"],
    });
    const index = buildGraphIndex(merged);
    const fresh = index.byHandle.get("@fresh")!;
    expect(fresh).toBe(6);
    expect(merged.positions.slice(fresh * 3, fresh * 3 + 3)).toEqual([
      13, 13, 1,
    ]);
    expect(isMutual(index, fresh, 0)).toBe(false);
  });

  it("reuses an up-to-date payload so personalisation does not rebuild the scene", () => {
    const original = payload();
    expect(withMe(original, { handle: "@rob", adds: ["@ana", "@mira"] })).toBe(
      original,
    );
  });

  it("leaves the payload untouched without a handle", () => {
    const original = payload();
    expect(withMe(original, { handle: null, adds: [] })).toBe(original);
  });
});
