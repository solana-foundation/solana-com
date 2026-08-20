import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = (await res.json()) as ClientStats;
    if (!Array.isArray(data.rows)) throw new Error("bad upstream payload");
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=30, stale-while-revalidate=300",
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
