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
    // A node upgrade can make this method available at any time, so do not pin
    // an unsupported capability response in the public edge cache.
    if (data.alpenglowRpcSupported === false) {
      return NextResponse.json(data, { headers: ALPENGLOW_NO_STORE_HEADERS });
    }

    const cachePolicy =
      data.alpenglowActive === true
        ? { fresh: 86_400, stale: 86_400 }
        : { fresh: 2, stale: 6 };

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
