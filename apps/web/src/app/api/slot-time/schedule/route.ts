import { NextResponse } from "next/server";
import {
  clientFamily,
  getClusterNodes,
  getCurrentVoteAccounts,
  getEpochInfo,
  getSlotLeaders,
  runsUpgradedClient,
} from "@/lib/slot200/rpc";
import validatorMeta from "@/data/slot200/validator-meta.json";

export const dynamic = "force-dynamic";

const SCHEDULE_SLOTS = 4000; // ~27 min of upcoming leaders at 400 ms

// identity -> [lat, lon, city, name] — committed snapshot from
// scripts/build-validator-meta.mjs (gossip IPs, city level)
const META = validatorMeta as unknown as Record<
  string,
  [number, number, string, string]
>;

export interface LeaderEntry {
  /** first 8 chars of the identity pubkey */
  id: string;
  name: string;
  city: string;
  ll: [number, number] | null;
  client: string;
  /** runs the release carrying the SIMD-0525 feature gates */
  up: boolean;
  /** share of total activated stake, percent */
  stakePct: number;
}

/**
 * The upcoming leader schedule with everything the dashboard attributes to a
 * block's producer: identity, self-published name, city (committed gossip-IP
 * snapshot), client family (gossip version), stake share. `leaders` holds one
 * dict index per upcoming slot. CDN-cached so all viewers share one RPC hit.
 */
export async function GET() {
  try {
    const [nodes, votes, info] = await Promise.all([
      getClusterNodes(),
      getCurrentVoteAccounts(),
      getEpochInfo(),
    ]);
    const leaders = await getSlotLeaders(info.absoluteSlot, SCHEDULE_SLOTS);

    const versionByIdentity = new Map(nodes.map((n) => [n.pubkey, n.version]));
    const totalStake = votes.reduce((a, v) => a + v.activatedStake, 0);
    const stakeByIdentity = new Map<string, number>();
    for (const v of votes)
      stakeByIdentity.set(
        v.nodePubkey,
        (stakeByIdentity.get(v.nodePubkey) ?? 0) + v.activatedStake,
      );

    let upgradedStake = 0;
    let upgradedCount = 0;
    for (const v of votes) {
      if (runsUpgradedClient(versionByIdentity.get(v.nodePubkey))) {
        upgradedStake += v.activatedStake;
        upgradedCount++;
      }
    }

    const dict: LeaderEntry[] = [];
    const indexByIdentity = new Map<string, number>();
    const slots: number[] = [];
    for (const identity of leaders) {
      let idx = indexByIdentity.get(identity);
      if (idx === undefined) {
        const meta = META[identity];
        const version = versionByIdentity.get(identity);
        idx = dict.length;
        indexByIdentity.set(identity, idx);
        dict.push({
          id: identity.slice(0, 8),
          name: meta?.[3] ?? "",
          city: meta?.[2] ?? "",
          ll: meta ? [meta[0], meta[1]] : null,
          client: clientFamily(version),
          up: runsUpgradedClient(version),
          stakePct:
            totalStake > 0
              ? Math.round(
                  ((stakeByIdentity.get(identity) ?? 0) / totalStake) * 1000,
                ) / 10
              : 0,
        });
      }
      slots.push(idx);
    }

    return NextResponse.json(
      {
        scheduleStart: info.absoluteSlot,
        slots,
        dict,
        network: {
          validators: votes.length,
          stakeM: Math.round(totalStake / 1e9 / 1e6),
          upgraded: {
            validators: upgradedCount,
            stakePct:
              totalStake > 0
                ? Math.round((upgradedStake / totalStake) * 1000) / 10
                : 0,
          },
        },
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
