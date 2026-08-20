import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLIENTS_CACHE_REVALIDATE_SECONDS = 30;
const CLIENTS_EDGE_STALE_SECONDS = 300;
const CLIENTS_CACHE_KEY = "slot200-clients-v2";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const UPSTREAM = "https://perp.so/api/slots/clients";

export interface ClientStatsRow {
  ct: number;
  client: string;
  /** Firedancer-family client */
  fd: boolean;
  slots: number;
  avg: number;
  median: number;
}

export interface ClientStats {
  rows: ClientStatsRow[];
  attributed: number;
  fromSlot: number | null;
  toSlot: number | null;
}

/**
 * The by-client slot-time table, proxied from the perp200 relay (perp.so/200,
 * public + CORS-open). The relay joins its rolling ~29-hour slot log to the
 * leader schedule and an identity→client map sourced from the on-chain
 * validator history program — the granularity (Jito, BAM, Harmonic, Rakurai…)
 * that gossip version strings alone cannot provide. CDN-cached so all
 * viewers share one upstream hit; the page falls back to its own
 * session-scoped gossip-family table when this route fails.
 */
async function loadClientStats(): Promise<ClientStats> {
  const res = await fetch(UPSTREAM, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  const data = (await res.json()) as ClientStats;
  if (!Array.isArray(data.rows)) throw new Error("bad upstream payload");
  return data;
}

const getClientStats = IS_PRODUCTION
  ? unstable_cache(loadClientStats, [CLIENTS_CACHE_KEY], {
      revalidate: CLIENTS_CACHE_REVALIDATE_SECONDS,
    })
  : loadClientStats;

export async function GET() {
  try {
    const data = await getClientStats();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=0, s-maxage=${CLIENTS_CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=${CLIENTS_EDGE_STALE_SECONDS}`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch client stats",
      },
      { status: 502 },
    );
  }
}
