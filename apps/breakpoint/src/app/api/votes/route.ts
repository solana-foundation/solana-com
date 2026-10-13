import { checkBotId } from "botid/server";
import { NextRequest, NextResponse } from "next/server";
import {
  findApprovedFinalist,
  getApprovedFinalists,
} from "@/content/awards-finalists";
import {
  clientCountry,
  clientIp,
  enforceVotingRateLimit,
  hasSameOrigin,
  hashIp,
} from "@/lib/awards-abuse";
import { getAwardsVotingStatus } from "@/lib/awards-campaign";
import { awardsPrisma } from "@/lib/awards-db";
import {
  awardsBallotCookie,
  newAwardsBallot,
  readAwardsBallot,
} from "@/lib/awards-session";

const NO_STORE = { "Cache-Control": "no-store" } as const;
const MAX_BODY_BYTES = 2_048;
const REJECTION_LOG_SAMPLE_RATE = 0.01;
const voteSelection = {
  category: true,
  twitterHandle: true,
  submittedAt: true,
} as const;

class BodyTooLargeError extends Error {}

function errorCode(value: unknown) {
  if (!value || typeof value !== "object" || !("code" in value)) return null;
  return typeof value.code === "string" && /^[A-Z0-9_]{1,40}$/.test(value.code)
    ? value.code
    : null;
}

function failure(
  method: "GET" | "POST",
  status: number,
  reason: string,
  message: string,
  options: { cause?: unknown; retryAfter?: number; vote?: unknown } = {},
) {
  const cause = options.cause;
  const nestedCause = cause instanceof Error ? cause.cause : undefined;
  const entry = {
    event: "awards_votes_failure",
    method,
    status,
    reason,
    ...(status < 500 ? { sampleRate: REJECTION_LOG_SAMPLE_RATE } : {}),
    ...(cause !== undefined
      ? {
          errorName: cause instanceof Error ? cause.name : typeof cause,
          errorCode: errorCode(cause),
          causeName:
            nestedCause instanceof Error ? nestedCause.name : undefined,
          causeCode: errorCode(nestedCause),
        }
      : {}),
  };
  const line = JSON.stringify(entry);
  if (status >= 500) console.error(line);
  else if (Math.random() < REJECTION_LOG_SAMPLE_RATE) console.log(line);
  return NextResponse.json(
    { error: message, ...(options.vote ? { vote: options.vote } : {}) },
    {
      status,
      headers: {
        ...NO_STORE,
        ...(options.retryAfter
          ? { "Retry-After": String(options.retryAfter) }
          : {}),
      },
    },
  );
}

async function parseBody(request: NextRequest): Promise<unknown> {
  if (!request.body) throw new SyntaxError("Missing body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new BodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function GET(request: NextRequest) {
  let ballotId: string;
  let cookie: ReturnType<typeof newAwardsBallot> | null = null;
  try {
    ballotId = readAwardsBallot(request) ?? "";
    if (!ballotId) {
      cookie = newAwardsBallot();
      ballotId = cookie.ballotId;
    }
    const user = await awardsPrisma.user.findUnique({
      where: { browserUuid: ballotId },
      select: { id: true },
    });
    const votes = user
      ? await awardsPrisma.vote.findMany({
          where: { userId: user.id },
          select: voteSelection,
          orderBy: { submittedAt: "asc" },
        })
      : [];
    const response = NextResponse.json(
      {
        votes,
        votingStatus: getAwardsVotingStatus(),
        finalistsReady: Boolean(getApprovedFinalists()),
      },
      { headers: NO_STORE },
    );
    if (cookie) {
      response.cookies.set(
        awardsBallotCookie.name,
        cookie.value,
        awardsBallotCookie.options,
      );
    }
    return response;
  } catch (error) {
    return failure("GET", 503, "load_failed", "Unable to load votes.", {
      cause: error,
    });
  }
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request))
    return failure(
      "POST",
      403,
      "origin_rejected",
      "This vote was not accepted.",
    );
  if (
    !/^application\/json(?:\s*;|\s*$)/i.test(
      request.headers.get("content-type") ?? "",
    )
  )
    return failure(
      "POST",
      415,
      "invalid_content_type",
      "Invalid request format.",
    );
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES)
    return failure("POST", 413, "body_too_large", "Request is too large.");

  let ballotId: string | null;
  try {
    ballotId = readAwardsBallot(request);
  } catch (error) {
    return failure(
      "POST",
      503,
      "ballot_validation_failed",
      "Voting is temporarily unavailable.",
      { cause: error },
    );
  }
  if (!ballotId)
    return failure(
      "POST",
      400,
      "ballot_missing",
      "Please refresh the page before voting.",
    );

  try {
    const status = getAwardsVotingStatus();
    if (status !== "open")
      return failure(
        "POST",
        403,
        `voting_${status}`,
        status === "closed"
          ? "Voting is closed."
          : "Voting has not opened yet.",
      );
    if (!getApprovedFinalists())
      return failure(
        "POST",
        503,
        "finalists_unavailable",
        "Finalists are not available yet.",
      );
    if (await enforceVotingRateLimit(request))
      return failure(
        "POST",
        429,
        "rate_limited",
        "Too many requests. Please try again shortly.",
        { retryAfter: 60 },
      );
    if ((await checkBotId()).isBot)
      return failure(
        "POST",
        403,
        "bot_rejected",
        "We could not verify this vote. Please try again.",
      );
  } catch (error) {
    return failure(
      "POST",
      503,
      "verification_failed",
      "Voting is temporarily unavailable.",
      { cause: error },
    );
  }

  let body: unknown;
  try {
    body = await parseBody(request);
  } catch (error) {
    return error instanceof BodyTooLargeError
      ? failure("POST", 413, "body_too_large", "Request is too large.")
      : failure("POST", 400, "invalid_json", "Invalid JSON body.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return failure("POST", 400, "invalid_json_shape", "Invalid JSON body.");
  const { categoryId, twitterHandle } = body as Record<string, unknown>;
  if (
    typeof categoryId !== "string" ||
    typeof twitterHandle !== "string" ||
    !/^@[a-z0-9_]{1,15}$/.test(twitterHandle)
  )
    return failure(
      "POST",
      400,
      "invalid_selection",
      "Choose a valid finalist.",
    );
  if (!findApprovedFinalist(categoryId, twitterHandle))
    return failure(
      "POST",
      400,
      "unknown_finalist",
      "Choose a finalist in this category.",
    );

  try {
    const ipHash = hashIp(clientIp(request));
    const country = clientCountry(request);
    const user = await awardsPrisma.user.upsert({
      where: { browserUuid: ballotId },
      create: { browserUuid: ballotId, ipHash, country },
      update: {},
      select: { id: true },
    });
    if (getAwardsVotingStatus() !== "open")
      return failure(
        "POST",
        403,
        "voting_closed_during_request",
        "Voting is closed.",
      );
    try {
      const vote = await awardsPrisma.vote.create({
        data: {
          userId: user.id,
          category: categoryId,
          twitterHandle,
          ipHash,
          country,
        },
        select: voteSelection,
      });
      return NextResponse.json({ vote }, { headers: NO_STORE });
    } catch (error) {
      if (errorCode(error) === "P2002") {
        const vote = await awardsPrisma.vote.findUnique({
          where: { userId_category: { userId: user.id, category: categoryId } },
          select: voteSelection,
        });
        if (vote)
          return failure(
            "POST",
            409,
            "already_voted",
            "You have already voted in this category.",
            { vote },
          );
      }
      throw error;
    }
  } catch (error) {
    return failure("POST", 503, "save_failed", "Unable to save vote.", {
      cause: error,
    });
  }
}
