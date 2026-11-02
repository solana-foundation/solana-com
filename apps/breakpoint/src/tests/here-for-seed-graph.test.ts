import { describe, expect, it } from "vitest";
import { normalizeHandle } from "@/lib/here-for/handles";
import { generateSeedGraph } from "../../scripts/here-for-seed-graph.mjs";

describe("here-for seed graph", () => {
  // 60/44 once stopped at 59 people when the eager joiners ran out.
  const runs = [
    [44, 60],
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].flatMap((seed) =>
      [3, 4, 12, 59, 60, 100].map((count) => [seed, count]),
    ),
    [2026, 1000],
  ];

  it.each(runs)("seed %i signs up exactly %i people", (seed, count) => {
    const { people } = generateSeedGraph(seed, count);
    const claimed = people.filter((p) => p.claimed);
    expect(claimed).toHaveLength(count);
    for (const p of claimed) {
      expect(new Set(p.targets).size).toBe(3);
      expect(p.targets).not.toContain(p);
    }
    const handles = people.map((p) => p.handle);
    expect(new Set(handles).size).toBe(handles.length);
    for (const handle of handles) expect(normalizeHandle(handle)).toBe(handle);
  });
});
