import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import {
  buildRpcAvgLatencyQuery,
  buildRpcP50LatencyQuery,
  buildRpcP99LatencyQuery,
  getRpcLatencyConfig,
  getRpcLatencyMetricRows,
  parseRpcLatencyQueryOptions,
  RPC_LATENCY_RANGE_HOURS,
  RPC_LATENCY_RANGE_STEP_SECONDS,
  type RpcLatencyConfig,
  type RpcLatencyQueryOptions,
} from "@/lib/rpc/server";
import type { DataApiResponse } from "@/app/[locale]/data/data-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RPC_CACHE_REVALIDATE_SECONDS = 60;
const EDGE_STALE_SECONDS = 5 * 60;
const RPC_CACHE_KEY_VERSION = "solana-data-rpc-latency-v2";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";
const DATA_UNAVAILABLE_ERROR =
  "Solana RPC latency data is unavailable right now. Try again in a moment.";

type ErrorResponse = {
  error: string;
  detail?: string;
  invalidEnv?: string[];
  missingEnv?: string[];
};

type RpcLatencyData = {
  generatedAt: string;
  rows: DataApiResponse["rows"];
  truncated: boolean;
};

export async function GET(request: NextRequest) {
  const configResult = getRpcLatencyConfig();

  if (!configResult.ok) {
    return json<ErrorResponse>(
      getConfigErrorResponse(configResult),
      503,
      NO_STORE_CACHE_CONTROL,
    );
  }

  try {
    const options = parseRpcLatencyQueryOptions(request.nextUrl.searchParams);
    const result = await getRpcLatencyData(configResult.config, options);

    return json<DataApiResponse>(
      {
        generatedAt: result.generatedAt,
        rangeDays: 0,
        rows: result.rows,
        truncated: result.truncated,
      },
      200,
      getSuccessCacheControl(),
    );
  } catch (error) {
    console.error("Failed to load Solana RPC latency data", error);

    return json<ErrorResponse>(
      getDataErrorResponse(error),
      502,
      NO_STORE_CACHE_CONTROL,
    );
  }
}

function getRpcLatencyData(
  config: RpcLatencyConfig,
  options: RpcLatencyQueryOptions,
): Promise<RpcLatencyData> {
  return IS_PRODUCTION
    ? getCachedRpcLatencyData(config, options)
    : fetchRpcLatencyData(config, options);
}

async function getCachedRpcLatencyData(
  config: RpcLatencyConfig,
  options: RpcLatencyQueryOptions,
) {
  const dataCacheKey = getRpcLatencyCacheKey(config, options);
  const cacheKeyParts = [RPC_CACHE_KEY_VERSION, dataCacheKey];

  return unstable_cache(
    () =>
      getInMemoryCachedRpcLatencyData(config, options, cacheKeyParts.join("|")),
    cacheKeyParts,
    {
      revalidate: RPC_CACHE_REVALIDATE_SECONDS,
      tags: ["solana-data-rpc-latency"],
    },
  )();
}

function fetchRpcLatencyData(
  config: RpcLatencyConfig,
  options: RpcLatencyQueryOptions,
) {
  return getRpcLatencyMetricRows(config, options);
}

const rpcLatencyDataRequests = new Map<string, Promise<RpcLatencyData>>();

function getInMemoryCachedRpcLatencyData(
  config: RpcLatencyConfig,
  options: RpcLatencyQueryOptions,
  cacheKey: string,
) {
  const cachedRequest = rpcLatencyDataRequests.get(cacheKey);

  if (cachedRequest) {
    return cachedRequest;
  }

  const request = fetchRpcLatencyData(config, options);

  request.then(
    () => rpcLatencyDataRequests.delete(cacheKey),
    () => rpcLatencyDataRequests.delete(cacheKey),
  );

  rpcLatencyDataRequests.set(cacheKey, request);

  return request;
}

function getRpcLatencyCacheKey(
  config: RpcLatencyConfig,
  options: RpcLatencyQueryOptions,
) {
  return [
    config.baseUrl,
    options.method,
    options.provider ?? "all",
    options.region,
    RPC_LATENCY_RANGE_HOURS,
    RPC_LATENCY_RANGE_STEP_SECONDS,
    buildRpcAvgLatencyQuery(options),
    buildRpcP50LatencyQuery(options),
    buildRpcP99LatencyQuery(options),
  ].join("|");
}

function getSuccessCacheControl() {
  if (!IS_PRODUCTION) {
    return NO_STORE_CACHE_CONTROL;
  }

  return [
    "public",
    "max-age=0",
    `s-maxage=${RPC_CACHE_REVALIDATE_SECONDS}`,
    `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
  ].join(", ");
}

function getConfigErrorResponse(
  configResult: Extract<ReturnType<typeof getRpcLatencyConfig>, { ok: false }>,
): ErrorResponse {
  return {
    error: "The RPC latency data source is not configured.",
    ...devOnly({
      invalidEnv: configResult.invalidEnv,
      missingEnv: configResult.missingEnv,
    }),
  };
}

function getDataErrorResponse(error: unknown): ErrorResponse {
  return {
    error: DATA_UNAVAILABLE_ERROR,
    ...devOnly({
      detail: error instanceof Error ? error.message : String(error),
    }),
  };
}

function devOnly<T extends Record<string, unknown>>(value: T) {
  return IS_PRODUCTION ? {} : value;
}

function json<T>(body: T, status: number, cacheControl: string) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": cacheControl,
    },
  });
}
