import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { getAvgSlotMs, getEpochInfo } from "@/lib/slot200/rpc";

export const dynamic = "force-dynamic";

const SLOT_CACHE_REVALIDATE_SECONDS = 20;
const SLOT_CACHE_KEY = "slot200-slot-v3";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

async function loadSlotInfo() {
  const [info, avgSlotMs] = await Promise.all([getEpochInfo(), getAvgSlotMs()]);
  return {
    epoch: info.epoch,
    absoluteSlot: info.absoluteSlot,
    epochEndSlot: info.absoluteSlot - info.slotIndex + info.slotsInEpoch,
    avgSlotMs: Math.round(avgSlotMs * 10) / 10,
    serverTime: Date.now(),
  };
}

const getSlotInfo = IS_PRODUCTION
  ? unstable_cache(loadSlotInfo, [SLOT_CACHE_KEY], {
      revalidate: SLOT_CACHE_REVALIDATE_SECONDS,
    })
  : loadSlotInfo;

export async function GET() {
  try {
    const data = await getSlotInfo();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=0, s-maxage=${SLOT_CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=60`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch slot info",
      },
      { status: 502 },
    );
  }
}
