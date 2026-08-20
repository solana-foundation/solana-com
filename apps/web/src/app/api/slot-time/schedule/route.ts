import { NextResponse } from "next/server";
import {
  getClusterNodes,
  getCurrentVoteAccounts,
  getEpochInfo,
  getSlotLeaders,
  runsUpgradedClient,
} from "@/lib/slot200/rpc";

export const dynamic = "force-dynamic";

const SCHEDULE_SLOTS = 4000; // ~27 min of upcoming leaders at 400 ms

/**
 * The live cohort schedule behind the hero pulses: which upcoming slots
 * belong to validators already running the 200 ms-ready release (Agave v4.2 /
 * Firedancer at the 4.2 compat level) vs validators still on older software.
 * Versions come from gossip; stake from the current vote accounts.
 */
export async function GET() {
  try {
    const [nodes, votes, info] = await Promise.all([
      getClusterNodes(),
      getCurrentVoteAccounts(),
      getEpochInfo(),
    ]);
    const leaders = await getSlotLeaders(info.absoluteSlot, SCHEDULE_SLOTS);

    const upgradedSet = new Set(
      nodes.filter((n) => runsUpgradedClient(n.version)).map((n) => n.pubkey),
    );

    let upgradedStake = 0;
    let legacyStake = 0;
    let upgradedCount = 0;
    let legacyCount = 0;
    for (const v of votes) {
      if (upgradedSet.has(v.nodePubkey)) {
        upgradedStake += v.activatedStake;
        upgradedCount++;
      } else {
        legacyStake += v.activatedStake;
        legacyCount++;
      }
    }
    const totalStake = upgradedStake + legacyStake;
    const pct = (n: number) =>
      totalStake > 0 ? Math.round((n / totalStake) * 1000) / 10 : 0;

    const bits = leaders.map((l) => (upgradedSet.has(l) ? "1" : "0")).join("");

    return NextResponse.json(
      {
        scheduleStart: info.absoluteSlot,
        bits,
        upgraded: { validators: upgradedCount, stakePct: pct(upgradedStake) },
        legacy: { validators: legacyCount, stakePct: pct(legacyStake) },
        serverTime: Date.now(),
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=180, stale-while-revalidate=600",
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch schedule",
      },
      { status: 502 },
    );
  }
}
