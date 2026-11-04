import { NextResponse } from "next/server";
import { getLiveAgenda, type LiveSessionsPayload } from "@/content/live/agenda";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Today's agenda for the live home page. The agenda itself is cached for
 * 30 minutes by the Airtable loader; this response carries the server time
 * so the client can place sessions on the clock without trusting its own.
 */
export async function GET() {
  const items = await getLiveAgenda();
  const payload: LiveSessionsPayload = { items, now: Date.now() };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
