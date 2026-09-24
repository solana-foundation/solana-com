import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import {
  getBlockFull,
  getConfirmedSlot,
  txProgramIds,
} from "@/lib/slot200/rpc";
import { classifyTx } from "@/lib/slot200/programs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Mainnet per-block compute ceiling (SIMD-0286). */
const BLOCK_CU_LIMIT = 100_000_000;
const BLOCK_CACHE_REVALIDATE_SECONDS = 4;
const BLOCK_EDGE_STALE_SECONDS = 20;
const BLOCK_CACHE_KEY = "slot200-block-v2";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// The eight Jito tip-payment accounts: lamports landing here are MEV tips.
const TIP_ACCOUNTS = new Set([
  "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
  "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
  "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
  "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
  "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
  "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
  "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
  "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
]);

interface BlockPayload {
  slot: number;
  blockTime: number | null;
  txs: number;
  votes: number;
  nonVotes: number;
  feeLamports: number;
  tipLamports: number;
  cu: number;
  cuPct: number;
  programs: { name: string; count: number }[];
  tape: { sig: string; p: string }[];
  serverTime: number;
}

const blockRequests = new Map<string, Promise<BlockPayload>>();

function getCachedBlock() {
  if (!IS_PRODUCTION) return loadBlock();

  return unstable_cache(
    () => {
      const cachedRequest = blockRequests.get(BLOCK_CACHE_KEY);
      if (cachedRequest) return cachedRequest;

      const request = loadBlock();
      request.then(
        () => blockRequests.delete(BLOCK_CACHE_KEY),
        () => blockRequests.delete(BLOCK_CACHE_KEY),
      );
      blockRequests.set(BLOCK_CACHE_KEY, request);
      return request;
    },
    [BLOCK_CACHE_KEY],
    { revalidate: BLOCK_CACHE_REVALIDATE_SECONDS },
  )();
}

/**
 * One recent confirmed block, decomposed against the known-program registry:
 * what the blockspace actually carried. Heavier than every other call on
 * this page (a full block is megabytes), so the response is compact and
 * CDN-cached — all viewers polling every few seconds share one RPC hit.
 */
async function loadBlock(): Promise<BlockPayload> {
  const tip = await getConfirmedSlot();
  // a couple of slots back so the block is reliably available
  let slot = tip - 2;
  let block = await getBlockFull(slot).catch(() => null);
  if (!block) {
    slot = tip - 4;
    block = await getBlockFull(slot);
  }
  if (!block) throw new Error("no recent block available");

  const counts = new Map<string, number>();
  let votes = 0;
  let feeLamports = 0;
  let tipLamports = 0;
  let cu = 0;
  const tape: { sig: string; p: string }[] = [];
  for (const tx of block.transactions) {
    const m = tx.meta;
    if (m) {
      feeLamports += m.fee ?? 0;
      cu += m.computeUnitsConsumed ?? 0;
      // balance arrays index static keys first, then loaded (writable,
      // readonly) — positive deltas on tip accounts are the tips
      if (m.preBalances && m.postBalances) {
        const staticKeys = tx.transaction.message.accountKeys;
        const writable = m.loadedAddresses?.writable ?? [];
        const readonly = m.loadedAddresses?.readonly ?? [];
        for (let i = 0; i < m.postBalances.length; i++) {
          const loadedIndex = i - staticKeys.length;
          const key =
            i < staticKeys.length
              ? staticKeys[i]
              : loadedIndex < writable.length
                ? writable[loadedIndex]
                : readonly[loadedIndex - writable.length];
          if (!key || !TIP_ACCOUNTS.has(key)) continue;
          const d = (m.postBalances[i] ?? 0) - (m.preBalances[i] ?? 0);
          if (d > 0) tipLamports += d;
        }
      }
    }
    const bucket = classifyTx(txProgramIds(tx));
    if (bucket === null) {
      votes++;
      continue;
    }
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    if (tape.length < 48)
      tape.push({
        sig: tx.transaction.signatures[0]?.slice(0, 8) ?? "",
        p: bucket,
      });
  }
  const programs = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    slot,
    blockTime: block.blockTime,
    txs: block.transactions.length,
    votes,
    nonVotes: block.transactions.length - votes,
    feeLamports,
    tipLamports,
    cu,
    cuPct: Math.round((cu / BLOCK_CU_LIMIT) * 100),
    programs,
    tape,
    serverTime: Date.now(),
  };
}

export async function GET() {
  try {
    const data = await getCachedBlock();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=0, s-maxage=${BLOCK_CACHE_REVALIDATE_SECONDS}, stale-while-revalidate=${BLOCK_EDGE_STALE_SECONDS}`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sample block" },
      { status: 502 },
    );
  }
}
