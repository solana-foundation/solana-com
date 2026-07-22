/** GitHub dark-theme contribution-graph palette. */
export const GH_EMPTY = "#161b22";
export const GH_CELL_BORDER = "#21262d";
/** Activity greens, least → most active. */
export const GH_LEVELS = ["#0e4429", "#006d32", "#26a641", "#39d353"] as const;

/**
 * Deterministic activity green for a cell index. A multiplicative hash
 * scatters the levels so an active span reads like a real contributions
 * graph instead of a flat block, and stays stable between renders.
 */
export function githubGreen(i: number): string {
  const t = (((i + 1) * 2654435761) >>> 0) % 1000;
  if (t < 150) return GH_LEVELS[0];
  if (t < 450) return GH_LEVELS[1];
  if (t < 800) return GH_LEVELS[2];
  return GH_LEVELS[3];
}
