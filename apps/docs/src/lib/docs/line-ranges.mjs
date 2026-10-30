/**
 * Line ranges in docs fence meta (`{1-3}`, `highlight={4,6-7}`, `focus={2}`).
 * A module of its own so the page components (CodeBody in
 * components/docs/docs-components.tsx) can read them without pulling in the
 * Shiki options (code-options.mjs).
 */

/** "1-3,5" -> Set{1,2,3,5} (1-based). */
export function parseRanges(value) {
  const out = new Set();
  for (const part of String(value ?? "").split(",")) {
    const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    for (let i = start; i <= end; i++) out.add(i);
  }
  return out;
}
