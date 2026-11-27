import { NextResponse } from "next/server";
import { rpc } from "@/lib/slot200/rpc";

export const dynamic = "force-dynamic";

const EDGE_CACHE_SECONDS = 2;

/**
 * One finality sample for the Solana 1.0 hero: the processed and finalized
 * heads read at the same moment. The client multiplies the rolling mean of
 * the gap by the measured slot time, so the figure is an estimate rather
 * than a per-block measurement. Edge-cached so viewers share RPC reads.
 */
export async function GET() {
  try {
    const [processed, finalized] = await Promise.all([
      rpc<number>("getSlot", [{ commitment: "processed" }]),
      rpc<number>("getSlot", [{ commitment: "finalized" }]),
    ]);
    return NextResponse.json(
      { processed, finalized },
      {
        headers: {
          "Cache-Control": `public, max-age=0, s-maxage=${EDGE_CACHE_SECONDS}, stale-while-revalidate=10`,
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read slots" },
      { status: 502 },
    );
  }
}
