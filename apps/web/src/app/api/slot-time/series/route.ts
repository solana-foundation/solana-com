import { NextResponse } from "next/server";
import { getPerformanceSamples } from "@/lib/slot200/rpc";

export const dynamic = "force-dynamic";

/**
 * Measured per-minute average slot time over the last ~12 hours (the RPC
 * keeps at most 720 one-minute performance samples). The history chart draws
 * this; the flip shows as a cliff. Oldest first.
 */
export async function GET() {
  try {
    const samples = await getPerformanceSamples(720);
    const now = Date.now();
    let back = 0;
    const points: { t: number; ms: number; tps: number }[] = [];
    // samples arrive newest first; walk time backwards from now
    for (const s of samples) {
      back += s.samplePeriodSecs * 1000;
      if (s.numSlots <= 0 || s.samplePeriodSecs <= 0) continue;
      points.push({
        t: now - back,
        ms: Math.round((s.samplePeriodSecs / s.numSlots) * 10000) / 10,
        tps: Math.round((s.numNonVoteTransactions ?? 0) / s.samplePeriodSecs),
      });
    }
    points.reverse();
    return NextResponse.json(
      { points, serverTime: now },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=55, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch series" },
      { status: 502 },
    );
  }
}
