import { computeLayout } from "./layout-core.mjs";
import type { GraphRows } from "./graph";
import type { LayoutSnapshot } from "./data";

export function layoutGraph(
  rows: GraphRows,
  previous: LayoutSnapshot["payload"] | null = null,
  options?: { ticks?: number },
): LayoutSnapshot["payload"] {
  return computeLayout(rows, previous, options) as LayoutSnapshot["payload"];
}
