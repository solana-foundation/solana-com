import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { getPerformanceSamples } from "@/lib/slot200/rpc";

export const dynamic = "force-dynamic";

const SERIES_CACHE_REVALIDATE_SECONDS = 55;
const SERIES_EDGE_STALE_SECONDS = 300;
const SERIES_CACHE_KEY = "slot200-series-v2";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Measured per-minute average slot time over the last ~12 hours (the RPC
 * keeps at most 720 one-minute performance samples). The history chart draws
 * this; the flip shows as a cliff. Oldest first.
 */
async function loadSeries() {
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
  return { points, serverTime: now };
}

const getSeries = IS_PRODUCTION
  ? unstable_cache(loadSeries, [SERIES_CACHE_KEY], {
      revalidate: SERIES_CACHE_REVALIDATE_SECONDS,
    })
  : loadSeries;

export async function GET() {
  try {
    const data = await getSeries();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=0, s-maxage=${SERIES_CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=${SERIES_EDGE_STALE_SECONDS}`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch series" },
      { status: 502 },
    );
  }
}
