// Provider columns, in display order. Names follow the dashboard's spelling
// (normalizeProviderName maps data-api's "DefiLlama" to "DeFiLlama").
export const stablecoinCoverageProviders = [
  "Allium",
  "Blockworks",
  "DeFiLlama",
  "Dune",
  "Top Ledger",
] as const;

export type StablecoinCoverageProvider =
  (typeof stablecoinCoverageProviders)[number];

export type StablecoinCoverageRow = {
  coverage: Record<StablecoinCoverageProvider, boolean>;
  mintAddress: string;
  /** Null when no symbol is known for the mint; the table then shows the shortened mint address. */
  token: string | null;
};

/** Body of /api/databricks/stablecoin-coverage. */
export type StablecoinCoverageResponse = {
  generatedAt: string;
  /** Largest circulating supply first, as data-api orders them. */
  rows: StablecoinCoverageRow[];
};

export function isStablecoinCoverageResponse(
  value: unknown,
): value is StablecoinCoverageResponse {
  return (
    !!value &&
    typeof value === "object" &&
    "rows" in value &&
    Array.isArray(value.rows)
  );
}
