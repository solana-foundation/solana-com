import { NextResponse } from "next/server";
import {
  epochOfSlot,
  getEpochInfo,
  type EpochInfo,
} from "@/lib/epoch1000/solana";
import {
  checkEpoch1000LookupRateLimit,
  clientIpFromHeaders,
} from "@/lib/epoch1000/rate-limit";
import {
  getCachedValidatorFirstTransaction,
  getHotValidatorFirstTransaction,
} from "@/lib/epoch1000/validator-cache";
import {
  isValidSolanaAddress,
  SOLANA_ADDRESS_ERROR,
} from "@/lib/epoch1000/public-key";
import { tierFor } from "@/lib/epoch1000/tiers";
import { type ValidatorLookup } from "@/lib/epoch1000/vote-account";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;

const NOT_FOUND_ERROR =
  "No validator history found for this vote account. Trillium only indexes validators active in recent epochs.";

export async function POST(req: Request) {
  let voteAccount: unknown;
  try {
    ({ voteAccount } = await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (
    typeof voteAccount !== "string" ||
    !isValidSolanaAddress(voteAccount.trim())
  ) {
    return NextResponse.json({ error: SOLANA_ADDRESS_ERROR }, { status: 400 });
  }

  const address = voteAccount.trim();
  const hotFirst = getHotValidatorFirstTransaction(address);

  if (hotFirst) {
    return validatorLookupResponse(address, hotFirst);
  }

  const rateLimit = checkEpoch1000LookupRateLimit({
    ip: clientIpFromHeaders(req.headers),
    wallet: address,
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
    return await validatorLookupResponse(
      address,
      getCachedValidatorFirstTransaction(address),
    );
  } finally {
    rateLimit.release();
  }
}

async function validatorLookupResponse(
  voteAccount: string,
  firstPromise: Promise<ValidatorLookup | null>,
) {
  try {
    const [first, info] = await Promise.all([firstPromise, getEpochInfo()]);

    if (!first) {
      return NextResponse.json(
        { error: NOT_FOUND_ERROR },
        {
          status: 404,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    return NextResponse.json(
      buildValidatorLookupPayload(voteAccount, first, info),
      {
        headers: NO_STORE_HEADERS,
      },
    );
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

function buildValidatorLookupPayload(
  voteAccount: string,
  first: ValidatorLookup,
  info: EpochInfo,
) {
  const firstEpoch = epochOfSlot(first.slot);
  const epochsSurvived = info.epoch - firstEpoch;
  const tier = tierFor(epochsSurvived);

  return {
    address: voteAccount,
    firstEpoch,
    firstSlot: first.slot,
    firstBlockTime: first.blockTime,
    firstSignature: first.signature,
    currentEpoch: info.epoch,
    epochsSurvived,
    tier: tier.name,
    capped: first.capped,
    scanned: first.scanned,
    logoUrl: first.logoUrl,
  };
}
