import { NextResponse } from "next/server";

import {
  getNetworkPulse,
  NETWORK_PULSE_REVALIDATE_SECONDS,
} from "@/lib/metrics/network-pulse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Live network counters, read from mainnet RPC at most once per window. */
export async function GET() {
  try {
    return NextResponse.json(await getNetworkPulse(), {
      headers: {
        "Cache-Control": `public, s-maxage=${NETWORK_PULSE_REVALIDATE_SECONDS}, stale-while-revalidate=${NETWORK_PULSE_REVALIDATE_SECONDS * 4}`,
      },
    });
  } catch (error) {
    console.error("[metrics] network pulse unavailable:", error);
    return NextResponse.json(
      { error: "Network stats are unavailable right now." },
      { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
