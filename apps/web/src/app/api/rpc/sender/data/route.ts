import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import type { DataApiResponse } from "@/app/[locale]/data/data-config";
import {
  getRpcSenderCacheKey,
  getRpcSenderMetricRows,
  parseRpcSenderQueryOptions,
  type RpcSenderQueryOptions,
} from "@/lib/rpc/sender-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RPC_SENDER_CACHE_REVALIDATE_SECONDS = 60;
const EDGE_STALE_SECONDS = 5 * 60;
const RPC_SENDER_CACHE_KEY_VERSION = "solana-data-rpc-sender-v1";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const NO_STORE_CACHE_CONTROL = "no-store, max-age=0";
const DATA_UNAVAILABLE_ERROR =
  "Solana transaction sender data is unavailable right now. Try again in a moment.";

type ErrorResponse = {
  detail?: string;
  error: string;
};

type RpcSenderData = {
  generatedAt: string;
  rows: DataApiResponse["rows"];
  truncated: boolean;
};

export async function GET(request: NextRequest) {
  try {
    const options = parseRpcSenderQueryOptions(request.nextUrl.searchParams);
    const result = await getRpcSenderData(options);

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
    console.error("Failed to load Solana transaction sender data", error);

    return json<ErrorResponse>(
      {
        error: DATA_UNAVAILABLE_ERROR,
        ...devOnly({
          detail: error instanceof Error ? error.message : String(error),
        }),
      },
      502,
      NO_STORE_CACHE_CONTROL,
    );
  }
}

function getRpcSenderData(options: RpcSenderQueryOptions) {
  return IS_PRODUCTION
    ? getCachedRpcSenderData(options)
    : fetchRpcSenderData(options);
}

function getCachedRpcSenderData(options: RpcSenderQueryOptions) {
  const dataCacheKey = getRpcSenderCacheKey(options);
  const cacheKeyParts = [RPC_SENDER_CACHE_KEY_VERSION, dataCacheKey];

  return unstable_cache(
    () => getInMemoryCachedRpcSenderData(options, cacheKeyParts.join("|")),
    cacheKeyParts,
    {
      revalidate: RPC_SENDER_CACHE_REVALIDATE_SECONDS,
      tags: ["solana-data-rpc-sender"],
    },
  )();
}

function fetchRpcSenderData(options: RpcSenderQueryOptions) {
  return getRpcSenderMetricRows(options);
}

const rpcSenderDataRequests = new Map<string, Promise<RpcSenderData>>();

function getInMemoryCachedRpcSenderData(
  options: RpcSenderQueryOptions,
  cacheKey: string,
) {
  const cachedRequest = rpcSenderDataRequests.get(cacheKey);

  if (cachedRequest) {
    return cachedRequest;
  }

  const request = fetchRpcSenderData(options);

  request.then(
    () => rpcSenderDataRequests.delete(cacheKey),
    () => rpcSenderDataRequests.delete(cacheKey),
  );

  rpcSenderDataRequests.set(cacheKey, request);

  return request;
}

function getSuccessCacheControl() {
  if (!IS_PRODUCTION) {
    return NO_STORE_CACHE_CONTROL;
  }

  return [
    "public",
    "max-age=0",
    `s-maxage=${RPC_SENDER_CACHE_REVALIDATE_SECONDS}`,
    `stale-while-revalidate=${EDGE_STALE_SECONDS}`,
  ].join(", ");
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
