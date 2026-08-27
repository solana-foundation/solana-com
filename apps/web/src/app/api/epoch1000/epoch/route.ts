import { NextResponse } from "next/server";
import {
  getAvgSlotMs,
  getEpochInfo,
  slotsUntilEpoch,
  TARGET_EPOCH,
} from "@/lib/epoch1000/solana";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [info, avgSlotMs] = await Promise.all([
      getEpochInfo(),
      getAvgSlotMs(),
    ]);
    const slotsRemaining = slotsUntilEpoch(TARGET_EPOCH, info);
    return NextResponse.json(
      {
        epoch: info.epoch,
        slotIndex: info.slotIndex,
        slotsInEpoch: info.slotsInEpoch,
        absoluteSlot: info.absoluteSlot,
        avgSlotMs,
        slotsRemaining,
        targetEpoch: TARGET_EPOCH,
        serverTime: Date.now(),
      },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=20" } },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch epoch info",
      },
      { status: 502 },
    );
  }
}
