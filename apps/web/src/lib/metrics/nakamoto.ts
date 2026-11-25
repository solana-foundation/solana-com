/**
 * Nakamoto coefficient: the fewest validators whose combined active stake
 * exceeds one third of the total, the share that can halt consensus.
 */
export function computeNakamotoCoefficient(
  stakes: readonly (string | number | bigint)[],
): number | undefined {
  const sorted = stakes
    .map((stake) => BigInt(stake))
    .sort((a, b) => (b > a ? 1 : b < a ? -1 : 0));
  const total = sorted.reduce((sum, stake) => sum + stake, BigInt(0));
  if (total === BigInt(0)) return undefined;

  const oneThird = total / BigInt(3);
  let cumulative = BigInt(0);
  let count = 0;
  for (const stake of sorted) {
    if (cumulative > oneThird) break;
    cumulative += stake;
    count++;
  }
  return count;
}
