import { NextRequest, NextResponse } from "next/server";
import {
  getAlpenglowDashboardData,
  isAlpenglowDashboardNetwork,
  isAlpenglowDashboardRange,
} from "@/lib/upgrades/alpenglow-metrics";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestedRange = request.nextUrl.searchParams.get("range");
  const range = isAlpenglowDashboardRange(requestedRange)
    ? requestedRange
    : "24h";
  const requestedNetwork = request.nextUrl.searchParams.get("network");
  const network = isAlpenglowDashboardNetwork(requestedNetwork)
    ? requestedNetwork
    : "testnet";

  try {
    const data = await getAlpenglowDashboardData(range, network);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=4, stale-while-revalidate=1",
      },
    });
  } catch (error) {
    console.error("Failed to build the Alpenglow metrics dashboard:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load Alpenglow metrics",
      },
      { status: 503 },
    );
  }
}
