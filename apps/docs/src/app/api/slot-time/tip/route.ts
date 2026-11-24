import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import {
  getBlockSignatures,
  getConfirmedSlot,
  RpcError,
} from "@/lib/docs-live/rpc";
import type { TipBlock, TipPayload } from "@/components/docs/use-polled-state";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * The confirmed tip and the blocks just behind it, light: each block's slot
 * and transaction count (getBlock with signatures only, about 35 KB a block
 * at 200 ms slots, trimmed here to a few hundred bytes a response). The docs
 * live feed shows 12 block tiles, so the payload carries no more than that.
 * The feed polls this about once a second; the one-second CDN and data cache
 * mean every reader shares one sampling round a second, however many are
 * watching. Each round reads only the newest blocks this instance hasn't read
 * yet: up to six with a configured RPC (SOLANA_RPC_URL; about 5 new blocks a
 * second at 200 ms slots, so it keeps up), one on the public endpoint, which
 * allows well under one getBlock a second; after a 429, none for ten seconds.
 * A block read that fails only leaves that slot out; the round fails only if
 * the tip can't be read.
 */
const TIP_CACHE_SECONDS = 1;
const TIP_EDGE_STALE_SECONDS = 2;
const TIP_CACHE_KEY = "slot200-tip-v3";
/** Blocks read per round, newest first: about 1.2 s of 200 ms slots. */
const FETCH_SLOTS = process.env.SOLANA_RPC_URL ? 6 : 1;
const BACKOFF_MS = 10_000;
/** Slots returned per response: the feed's 12 tiles, so a reader who missed
 * a poll can catch up. */
const RETURN_SLOTS = 12;
const KEEP_SLOTS = 40;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// No block was produced in this slot (skipped), or it was cleaned up.
const SKIPPED = [-32007, -32009];
// The block isn't available yet: try it again next round.
const NOT_YET = [-32004, -32014];

/** Blocks read so far on this instance, by slot; null for a skipped slot. */
const known = new Map<number, TipBlock | null>();
let backoffUntil = 0;

async function readSlot(slot: number): Promise<void> {
  try {
    const block = await getBlockSignatures(slot);
    if (!block) return;
    known.set(slot, { slot, txs: block.signatures.length });
  } catch (error) {
    const code = error instanceof RpcError ? (error.code ?? 0) : 0;
    if (SKIPPED.includes(code)) known.set(slot, null);
    else if (!NOT_YET.includes(code)) {
      if (String(error).includes(" 429"))
        backoffUntil = Date.now() + BACKOFF_MS;
      throw error;
    }
  }
}

async function loadTip(): Promise<TipPayload> {
  const tip = await getConfirmedSlot();
  const budget = Date.now() < backoffUntil ? 0 : FETCH_SLOTS;
  const wanted: number[] = [];
  for (let s = tip; s > tip - RETURN_SLOTS && wanted.length < budget; s--)
    if (!known.has(s)) wanted.push(s);
  await Promise.allSettled(wanted.map(readSlot));

  for (const s of known.keys()) if (s <= tip - KEEP_SLOTS) known.delete(s);
  const blocks: TipBlock[] = [];
  const skipped: number[] = [];
  for (let s = tip - RETURN_SLOTS + 1; s <= tip; s++) {
    const b = known.get(s);
    if (b) blocks.push(b);
    else if (b === null) skipped.push(s);
  }
  return { tip, blocks, skipped, serverTime: Date.now() };
}

// One upstream round per instance at a time, however many requests arrive.
let inFlight: Promise<TipPayload> | null = null;
function loadTipOnce() {
  inFlight ??= loadTip().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

const getTip = IS_PRODUCTION
  ? unstable_cache(loadTipOnce, [TIP_CACHE_KEY], {
      revalidate: TIP_CACHE_SECONDS,
    })
  : loadTipOnce;

export async function GET() {
  try {
    const data = await getTip();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=0, s-maxage=${TIP_CACHE_SECONDS}, stale-while-revalidate=${TIP_EDGE_STALE_SECONDS}`,
      },
    });
  } catch {
    return NextResponse.json(
      // Never the error text: a fetch error can carry the RPC URL and its key.
      { error: "Failed to read the tip" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
