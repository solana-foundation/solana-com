import { NextResponse } from "next/server";
import {
  getBlockFull,
  getConfirmedSlot,
  txProgramIds,
} from "@/lib/slot200/rpc";
import { classifyTx } from "@/lib/slot200/programs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * One recent confirmed block, decomposed against the known-program registry:
 * what the blockspace actually carried. Heavier than every other call on
 * this page (a full block is megabytes), so the response is compact and
 * CDN-cached — all viewers polling every few seconds share one RPC hit.
 */
export async function GET() {
  try {
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
    const tape: { sig: string; p: string }[] = [];
    for (const tx of block.transactions) {
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

    return NextResponse.json(
      {
        slot,
        blockTime: block.blockTime,
        txs: block.transactions.length,
        votes,
        nonVotes: block.transactions.length - votes,
        programs,
        tape,
        serverTime: Date.now(),
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=4, stale-while-revalidate=20",
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to sample block" },
      { status: 502 },
    );
  }
}
