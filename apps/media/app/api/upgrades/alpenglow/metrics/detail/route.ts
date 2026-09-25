import { NextRequest, NextResponse } from "next/server";
import {
  getAlpenglowDetailData,
  isAlpenglowDashboardNetwork,
  isAlpenglowDashboardRange,
} from "@/lib/upgrades/alpenglow-metrics";
import {
  ALPENGLOW_NO_STORE_HEADERS,
  alpenglowPublicCacheHeaders,
} from "@/lib/upgrades/alpenglow-metrics-http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestedRange = request.nextUrl.searchParams.get("range");
  const requestedNetwork = request.nextUrl.searchParams.get("network");

  if (requestedRange !== null && !isAlpenglowDashboardRange(requestedRange)) {
    return NextResponse.json(
      { error: "Unsupported dashboard range" },
      { status: 400, headers: ALPENGLOW_NO_STORE_HEADERS },
    );
  }
  if (
    requestedNetwork !== null &&
    !isAlpenglowDashboardNetwork(requestedNetwork)
  ) {
    return NextResponse.json(
      { error: "Unsupported dashboard network" },
      { status: 400, headers: ALPENGLOW_NO_STORE_HEADERS },
    );
  }

  const range = isAlpenglowDashboardRange(requestedRange)
    ? requestedRange
    : "24h";
  const network = isAlpenglowDashboardNetwork(requestedNetwork)
    ? requestedNetwork
    : "testnet";

  try {
    const data = await getAlpenglowDetailData(range, network);
    return NextResponse.json(data, {
      headers: alpenglowPublicCacheHeaders(8, 24),
    });
  } catch (error) {
    console.error("Failed to load Alpenglow metric details:", error);
    return NextResponse.json(
      { error: "Unable to load Alpenglow metric details" },
      { status: 503, headers: ALPENGLOW_NO_STORE_HEADERS },
    );
  }
}
