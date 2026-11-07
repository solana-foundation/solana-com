import { NextRequest, NextResponse } from "next/server";
import { loadGraph, loadSnapshot, saveSnapshot } from "@/lib/here-for/data";
import { layoutGraph } from "@/lib/here-for/layout";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (
    (secret && request.headers.get("authorization") !== `Bearer ${secret}`) ||
    (!secret && process.env.NODE_ENV === "production")
  )
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const [rows, previous] = await Promise.all([loadGraph(), loadSnapshot()]);
    const start = performance.now();
    const layout = layoutGraph(rows, previous?.payload ?? null);
    const snapshot = await saveSnapshot(rows, layout);
    return NextResponse.json(
      {
        id: snapshot.id,
        nodeCount: rows.people.length,
        linkCount: rows.adds.length,
        durationMs: Math.round(performance.now() - start),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Layout unavailable.", code: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
