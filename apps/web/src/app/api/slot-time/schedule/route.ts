import { unstable_cache } from "next/cache";
import { NextResponse, after } from "next/server";
import {
  clientFamily,
  getClusterNodes,
  getCurrentVoteAccounts,
  getEpochInfo,
  getSlotLeaders,
  runsUpgradedClient,
} from "@/lib/slot200/rpc";
import {
  CLIENT_NAMES,
  loadValidatorClientTypes,
} from "@/lib/slot200/validatorHistory";
import validatorMeta from "@/data/slot200/validator-meta.json";

export const dynamic = "force-dynamic";
// the on-chain client-identity load may finish after the response via after()
export const maxDuration = 60;

const SCHEDULE_SLOTS = 4000; // ~27 min of upcoming leaders at 400 ms
const SCHEDULE_CACHE_REVALIDATE_SECONDS = 180;
const SCHEDULE_EDGE_STALE_SECONDS = 600;
const SCHEDULE_CACHE_KEY = "slot200-schedule-v2";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ── on-chain client identity, cached per epoch ──
// The validator-history sweep is the one genuinely heavy fetch on this page
// (a filtered getProgramAccounts plus ~30 sliced getMultipleAccounts), so it
// runs at most once per epoch per region (epoch is part of the cache key;
// the revalidate is a backstop for validators switching clients mid-epoch).
// The schedule response never waits long for it: a cold sweep gets a short
// grace, then the response ships gossip families and after() lets the sweep
// finish into the cache for the next hit.
const CLIENTS_CACHE_REVALIDATE_SECONDS = 21_600;
const CLIENTS_COLD_WAIT_MS = 2_500;
const CLIENTS_FAILURE_COOLDOWN_MS = 120_000;

const getClientTypesForEpoch = IS_PRODUCTION
  ? unstable_cache(
      async (_epoch: number) => loadValidatorClientTypes(),
      ["slot200-client-types-v1"],
      { revalidate: CLIENTS_CACHE_REVALIDATE_SECONDS },
    )
  : async (_epoch: number) => loadValidatorClientTypes();

const CLIENTS_MEMO_TTL_MS = 1_800_000;
let clientTypesMemo: {
  epoch: number;
  at: number;
  promise: Promise<Record<string, number>>;
} | null = null;
let clientTypesLastFailure = 0;

// Per-instance memo over the shared cache: regenerations reuse one resolved
// sweep (dev, with no data cache, would otherwise re-sweep every request),
// re-checked on epoch change or after the TTL to pick up revalidations.
function getClientTypes(epoch: number): Promise<Record<string, number>> {
  const now = Date.now();
  if (
    !clientTypesMemo ||
    clientTypesMemo.epoch !== epoch ||
    now - clientTypesMemo.at > CLIENTS_MEMO_TTL_MS
  ) {
    const entry = {
      epoch,
      at: now,
      promise: getClientTypesForEpoch(epoch),
    };
    entry.promise.catch(() => {
      if (clientTypesMemo === entry) clientTypesMemo = null;
    });
    clientTypesMemo = entry;
  }
  return clientTypesMemo.promise;
}

/** Resolves to {} when the sweep is cold/slow/failing — never throws. */
async function clientTypesWithGrace(
  epoch: number,
): Promise<Record<string, number>> {
  if (Date.now() - clientTypesLastFailure < CLIENTS_FAILURE_COOLDOWN_MS)
    return {};
  const sweep = getClientTypes(epoch).catch((err) => {
    clientTypesLastFailure = Date.now();
    throw err;
  });
  const winner = await Promise.race([
    sweep,
    new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), CLIENTS_COLD_WAIT_MS),
    ),
  ]).catch(() => ({}) as Record<string, number>);
  if (winner !== null) return winner;
  // response goes out with gossip families; the sweep keeps filling the cache
  after(sweep.catch(() => {}));
  return {};
}

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
 * snapshot), client (on-chain validator history, gossip-family fallback),
 * stake share. `leaders` holds one dict index per upcoming slot. CDN-cached
 * so all viewers share one RPC hit.
 */
async function loadSchedule() {
  const [nodes, votes, info] = await Promise.all([
    getClusterNodes(),
    getCurrentVoteAccounts(),
    getEpochInfo(),
  ]);
  const [leaders, clientTypes] = await Promise.all([
    getSlotLeaders(info.absoluteSlot, SCHEDULE_SLOTS),
    clientTypesWithGrace(info.epoch),
  ]);

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
        // on-chain identity first; gossip family when the chain has none
        client:
          (identity in clientTypes
            ? CLIENT_NAMES[clientTypes[identity]]
            : undefined) ?? clientFamily(version),
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

  return {
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
  };
}

const getSchedule = IS_PRODUCTION
  ? unstable_cache(loadSchedule, [SCHEDULE_CACHE_KEY], {
      revalidate: SCHEDULE_CACHE_REVALIDATE_SECONDS,
    })
  : loadSchedule;

export async function GET() {
  try {
    const data = await getSchedule();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=0, s-maxage=${SCHEDULE_CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=${SCHEDULE_EDGE_STALE_SECONDS}`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch schedule",
      },
      { status: 502 },
    );
  }
}
