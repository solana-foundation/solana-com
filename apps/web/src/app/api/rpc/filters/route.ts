import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import type { RpcLatencyFiltersResponse } from "@/app/[locale]/data/data-config";
import {
  getRpcLatencyConfig,
  getRpcLatencyFilterOptions,
  type RpcLatencyConfig,
} from "@/lib/rpc/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const FILTER_CACHE_REVALIDATE_SECONDS = 5 * 60;
const EDGE_STALE_SECONDS = 60 * 60;
const FILTER_CACHE_KEY_VERSION = "solana-data-rpc-filters-v2";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";

type ErrorResponse = {
  error: string;
};

export async function GET() {
  const configResult = getRpcLatencyConfig();

  if (!configResult.ok) {
    return json<ErrorResponse>(
      { error: "The RPC latency data source is not configured." },
      503,
      NO_STORE_CACHE_CONTROL,
    );
  }

  try {
    const filters = await getRpcFilters(configResult.config);

    return json<RpcLatencyFiltersResponse>(
      filters,
      200,
      getSuccessCacheControl(),
    );
  } catch (error) {
    console.error("Failed to load Solana RPC latency filters", error);

    return json<ErrorResponse>(
      { error: "Solana RPC latency filters are unavailable right now." },
      502,
      NO_STORE_CACHE_CONTROL,
    );
  }
}

function getRpcFilters(config: RpcLatencyConfig) {
  if (!IS_PRODUCTION) {
    return getRpcLatencyFilterOptions(config);
  }

  const cacheKeyParts = [FILTER_CACHE_KEY_VERSION, config.baseUrl];

  return unstable_cache(
    () => getInMemoryCachedRpcFilters(config, cacheKeyParts.join("|")),
    cacheKeyParts,
    {
      revalidate: FILTER_CACHE_REVALIDATE_SECONDS,
      tags: ["solana-data-rpc-filters"],
    },
  )();
}

const rpcFilterRequests = new Map<string, Promise<RpcLatencyFiltersResponse>>();

function getInMemoryCachedRpcFilters(
  config: RpcLatencyConfig,
  cacheKey: string,
) {
  const cachedRequest = rpcFilterRequests.get(cacheKey);

  if (cachedRequest) {
    return cachedRequest;
  }

  const request = getRpcLatencyFilterOptions(config);

  request.then(
    () => rpcFilterRequests.delete(cacheKey),
    () => rpcFilterRequests.delete(cacheKey),
  );

  rpcFilterRequests.set(cacheKey, request);

  return request;
}

function getSuccessCacheControl() {
  if (!IS_PRODUCTION) {
    return NO_STORE_CACHE_CONTROL;
  }

  return [
    "public",
    "max-age=0",
    `s-maxage=${FILTER_CACHE_REVALIDATE_SECONDS}`,
    `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
  ].join(", ");
}

function json<T>(body: T, status: number, cacheControl: string) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": cacheControl,
    },
  });
}
