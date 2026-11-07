export function computeLayout(
  rows: {
    people: { id: string; handle: string }[];
    adds: { fromId: string; toId: string }[];
  },
  previous?: { positions: Record<string, [number, number, number]> } | null,
  options?: { ticks?: number },
): {
  positions: Record<string, [number, number, number]>;
  community: Record<string, number>;
  communities: { id: number; size: number; label: string }[];
};
