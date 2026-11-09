import { NextResponse } from "next/server";
import { loadGraph, loadSnapshot } from "@/lib/here-for/data";
import { graphPayload } from "@/lib/here-for/payload";
export const runtime = "nodejs";
export async function GET() {
  try {
    const [rows, snapshot] = await Promise.all([loadGraph(), loadSnapshot()]);
    return NextResponse.json(graphPayload(rows, snapshot), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Graph unavailable.", code: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
