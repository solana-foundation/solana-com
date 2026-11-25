import "server-only";

import { normalizeProviderName } from "@/app/[locale]/data/data-config";
import {
  stablecoinCoverageProviders,
  type StablecoinCoverageResponse,
  type StablecoinCoverageRow,
} from "@/app/[locale]/data/stablecoin-coverage-data";
import { type DataApiConfig, DataApiResponseError } from "./server";

type CoverageResponse = {
  data?: {
    generatedAt?: string;
    rows?: unknown[];
  };
};

/**
 * Which providers report each Solana stablecoin, from data-api's
 * /stablecoin-coverage. Rows keep data-api's order (largest circulating
 * supply first); the supply values themselves never leave data-api.
 */
export async function getStablecoinCoverage(
  config: DataApiConfig,
): Promise<StablecoinCoverageResponse> {
  const response = await fetch(`${config.baseUrl}/stablecoin-coverage`, {
    cache: "no-store",
    headers: { "x-api-key": config.apiKey },
  });

  const payload = (await response
    .json()
    .catch(() => null)) as CoverageResponse | null;

  if (!response.ok) {
    throw new DataApiResponseError(
      "data-api stablecoin coverage request",
      `${response.status} ${response.statusText}`.trim(),
    );
  }

  if (!Array.isArray(payload?.data?.rows)) {
    throw new DataApiResponseError(
      "data-api stablecoin coverage response",
      "invalid-payload",
    );
  }

  const { generatedAt, rows } = payload.data;

  return {
    generatedAt:
      generatedAt && !Number.isNaN(Date.parse(generatedAt))
        ? generatedAt
        : new Date().toISOString(),
    rows: rows.flatMap((record) => {
      const row = toCoverageRow(record);

      return row ? [row] : [];
    }),
  };
}

function toCoverageRow(record: unknown): StablecoinCoverageRow | null {
  const { coverage, mint_address, token } = (record ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof mint_address !== "string" ||
    !mint_address ||
    !coverage ||
    typeof coverage !== "object"
  ) {
    return null;
  }

  const covered = new Set(
    Object.entries(coverage)
      .filter(([, value]) => value === true)
      .map(([provider]) => normalizeProviderName(provider)),
  );

  return {
    coverage: Object.fromEntries(
      stablecoinCoverageProviders.map((provider) => [
        provider,
        covered.has(provider),
      ]),
    ) as StablecoinCoverageRow["coverage"],
    mintAddress: mint_address,
    token: typeof token === "string" && token.trim() ? token : null,
  };
}
