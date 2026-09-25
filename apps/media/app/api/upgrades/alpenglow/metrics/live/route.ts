import { NextRequest, NextResponse } from "next/server";
import {
  ALPENGLOW_LIVE_MAXIMUM_AGE_SECONDS,
  getAlpenglowLiveData,
  isAlpenglowDashboardNetwork,
} from "@/lib/upgrades/alpenglow-metrics";
import {
  ALPENGLOW_NO_STORE_HEADERS,
  alpenglowFreshSnapshotCacheHeaders,
} from "@/lib/upgrades/alpenglow-metrics-http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestedNetwork = request.nextUrl.searchParams.get("network");
  if (
    requestedNetwork !== null &&
    !isAlpenglowDashboardNetwork(requestedNetwork)
  ) {
    return NextResponse.json(
      { error: "Unsupported dashboard network" },
      { status: 400, headers: ALPENGLOW_NO_STORE_HEADERS },
    );
  }

  const network = isAlpenglowDashboardNetwork(requestedNetwork)
    ? requestedNetwork
    : "testnet";

  try {
    const data = await getAlpenglowLiveData(network);
    return NextResponse.json(data, {
      headers: alpenglowFreshSnapshotCacheHeaders(
        data.generatedAt,
        8,
        ALPENGLOW_LIVE_MAXIMUM_AGE_SECONDS,
      ),
    });
  } catch (error) {
    console.error("Failed to load live Alpenglow metrics:", error);
    return NextResponse.json(
      { error: "Unable to load live Alpenglow metrics" },
      { status: 503, headers: ALPENGLOW_NO_STORE_HEADERS },
    );
  }
}
