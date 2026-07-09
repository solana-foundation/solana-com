import { NextResponse } from "next/server";
import {
  epochOfSlot,
  getEpochInfo,
  type FirstTx,
  type EpochInfo,
} from "@/lib/epoch1000/solana";
import {
  checkEpoch1000LookupRateLimit,
  clientIpFromHeaders,
} from "@/lib/epoch1000/rate-limit";
import {
  getCachedFirstTransaction,
  getHotFirstTransaction,
} from "@/lib/epoch1000/wallet-cache";
import {
  isValidSolanaAddress,
  SOLANA_ADDRESS_ERROR,
} from "@/lib/epoch1000/public-key";
import { tierFor } from "@/lib/epoch1000/tiers";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;

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
    return NextResponse.json({ error: SOLANA_ADDRESS_ERROR }, { status: 400 });
  }
  const wallet = address.trim();
  const hotFirst = getHotFirstTransaction(wallet);

  if (hotFirst) {
    return walletLookupResponse(wallet, hotFirst);
  }

  const rateLimit = checkEpoch1000LookupRateLimit({
    ip: clientIpFromHeaders(req.headers),
    wallet,
  });

  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: rateLimit.error },
      {
        status: 429,
        headers: {
          ...NO_STORE_HEADERS,
          "Retry-After": String(rateLimit.retryAfter),
        },
      },
    );
  }

  try {
    return await walletLookupResponse(
      wallet,
      getCachedFirstTransaction(wallet),
    );
  } finally {
    rateLimit.release();
  }
}

async function walletLookupResponse(
  wallet: string,
  firstPromise: Promise<FirstTx | null>,
) {
  try {
    const [first, info] = await Promise.all([firstPromise, getEpochInfo()]);

    if (!first) {
      return NextResponse.json(
        { error: "No transactions found for this address on mainnet." },
        {
          status: 404,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    return NextResponse.json(buildWalletLookupPayload(wallet, first, info), {
      headers: NO_STORE_HEADERS,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Lookup failed. Try again.",
      },
      {
        status: 502,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}

function buildWalletLookupPayload(
  wallet: string,
  first: FirstTx,
  info: EpochInfo,
) {
  const firstEpoch = epochOfSlot(first.slot);
  const epochsSurvived = info.epoch - firstEpoch;
  const tier = tierFor(epochsSurvived);

  return {
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
  };
}
