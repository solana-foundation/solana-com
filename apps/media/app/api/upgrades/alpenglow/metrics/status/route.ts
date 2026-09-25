import { NextRequest, NextResponse } from "next/server";
import {
  getAlpenglowActivationData,
  isAlpenglowDashboardNetwork,
} from "@/lib/upgrades/alpenglow-metrics";
import {
  ALPENGLOW_NO_STORE_HEADERS,
  alpenglowPublicCacheHeaders,
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
    const data = await getAlpenglowActivationData(network);
    const cachePolicy =
      data.alpenglowActive === true
        ? { fresh: 86_400, stale: 86_400 }
        : data.alpenglowRpcSupported === false
          ? { fresh: 300, stale: 600 }
          : { fresh: 10, stale: 30 };

    return NextResponse.json(data, {
      headers: alpenglowPublicCacheHeaders(
        cachePolicy.fresh,
        cachePolicy.stale,
      ),
    });
  } catch (error) {
    console.error("Failed to load Alpenglow activation status:", error);
    return NextResponse.json(
      { error: "Unable to load Alpenglow activation status" },
      { status: 503, headers: ALPENGLOW_NO_STORE_HEADERS },
    );
  }
}
