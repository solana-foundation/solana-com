import { NextResponse } from "next/server";
import { getAvgSlotMs, getEpochInfo } from "@/lib/slot200/rpc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [info, avgSlotMs] = await Promise.all([
      getEpochInfo(),
      getAvgSlotMs(),
    ]);
    return NextResponse.json(
      {
        epoch: info.epoch,
        absoluteSlot: info.absoluteSlot,
        avgSlotMs: Math.round(avgSlotMs * 10) / 10,
        serverTime: Date.now(),
      },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=20" } },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch slot info",
      },
      { status: 502 },
    );
  }
}
