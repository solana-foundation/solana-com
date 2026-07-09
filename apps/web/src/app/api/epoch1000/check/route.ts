import { NextResponse } from "next/server";
import {
  epochOfSlot,
  findFirstTransaction,
  getEpochInfo,
  isValidSolanaAddress,
} from "@/lib/epoch1000/solana";
import { tierFor } from "@/lib/epoch1000/tiers";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let address: unknown;
  try {
    ({ address } = await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (typeof address !== "string" || !isValidSolanaAddress(address.trim())) {
    return NextResponse.json(
      {
        error:
          "That doesn't look like a Solana address. Check it and try again.",
      },
      { status: 400 },
    );
  }
  const wallet = address.trim();

  try {
    const [first, info] = await Promise.all([
      findFirstTransaction(wallet),
      getEpochInfo(),
    ]);

    if (!first) {
      return NextResponse.json(
        { error: "No transactions found for this address on mainnet." },
        { status: 404 },
      );
    }

    const firstEpoch = epochOfSlot(first.slot);
    const epochsSurvived = info.epoch - firstEpoch;
    const tier = tierFor(epochsSurvived);

    return NextResponse.json({
      address: wallet,
      firstEpoch,
      firstSlot: first.slot,
      firstBlockTime: first.blockTime,
      firstSignature: first.signature,
      currentEpoch: info.epoch,
      epochsSurvived,
      tier: tier.name,
      capped: first.capped,
      scanned: first.scanned,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Lookup failed. Try again.",
      },
      { status: 502 },
    );
  }
}
