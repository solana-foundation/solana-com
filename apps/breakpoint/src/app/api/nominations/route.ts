import { checkBotId } from "botid/server";
import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { awardCategories } from "@/content/awards";
import {
  clientCountry,
  clientIp,
  enforceSubmissionRateLimit,
  hasSameOrigin,
  hashIp,
} from "@/lib/awards-abuse";
import {
  campaignMessage,
  getAwardsCampaignStatus,
} from "@/lib/awards-campaign";
import { awardsPrisma } from "@/lib/awards-db";
import {
  awardsBallotCookie,
  newAwardsBallot,
  readAwardsBallot,
} from "@/lib/awards-session";

const categoryIds = new Set<string>(
  awardCategories.map((category) => category.id),
);
const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;
const MAX_BODY_BYTES = 2_048;
const REJECTION_LOG_SAMPLE_RATE = 0.01;

class RequestBodyTooLargeError extends Error {}

function errorCode(value: unknown) {
  if (!value || typeof value !== "object" || !("code" in value)) return null;
  const code = value.code;
  return typeof code === "string" && /^[A-Z0-9_]{1,40}$/.test(code)
    ? code
    : null;
}

function failureResponse(
  method: "GET" | "POST",
  status: number,
  reason: string,
  message: string,
  options: { cause?: unknown; retryAfter?: number } = {},
) {
  const cause = options.cause;
  const nestedCause = cause instanceof Error ? cause.cause : undefined;
  const entry = {
    event: "awards_nominations_failure",
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

  // Vercel records every response status. Sample expected rejections so
  // invalid traffic cannot flood function logs; always log server failures.
  // Avoid logging request bodies, usernames, cookies, or IPs.
  const line = JSON.stringify(entry);
  if (status >= 500) console.error(line);
  else if (Math.random() < REJECTION_LOG_SAMPLE_RATE) console.log(line);

  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        ...NO_STORE_HEADERS,
        ...(options.retryAfter
          ? { "Retry-After": String(options.retryAfter) }
          : {}),
      },
    },
  );
}

async function parseJsonBody(request: NextRequest): Promise<unknown> {
  if (!request.body) throw new SyntaxError("Request body is missing.");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bodyLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bodyLength += value.byteLength;
      if (bodyLength > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(bodyLength);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(body));
}

function handle(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/^@+/, "").toLowerCase();
  return /^[a-z0-9_]{1,15}$/i.test(normalized) ? `@${normalized}` : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function GET(request: NextRequest) {
  let ballotId: string | null;
  let cookie: ReturnType<typeof newAwardsBallot> | null = null;
  try {
    ballotId = readAwardsBallot(request);
    if (!ballotId) {
      cookie = newAwardsBallot();
      ballotId = cookie.ballotId;
    }
  } catch (error) {
    return failureResponse(
      "GET",
      503,
      "ballot_initialization_failed",
      "Nominations are temporarily unavailable.",
      { cause: error },
    );
  }

  try {
    const user = await awardsPrisma.user.findUnique({
      where: { browserUuid: ballotId },
    });
    const campaignStatus = getAwardsCampaignStatus();
    if (!user) {
      const response = NextResponse.json(
        { nominations: [], campaignStatus },
        { headers: NO_STORE_HEADERS },
      );
      if (cookie)
        response.cookies.set(
          awardsBallotCookie.name,
          cookie.value,
          awardsBallotCookie.options,
        );
      return response;
    }
    const nominations = await awardsPrisma.nomination.findMany({
      where: { userId: user.id },
      select: { category: true, twitterHandle: true, submittedAt: true },
      orderBy: { submittedAt: "desc" },
    });
    const response = NextResponse.json(
      { nominations, campaignStatus },
      { headers: NO_STORE_HEADERS },
    );
    if (cookie)
      response.cookies.set(
        awardsBallotCookie.name,
        cookie.value,
        awardsBallotCookie.options,
      );
    return response;
  } catch (error) {
    return failureResponse(
      "GET",
      503,
      "load_failed",
      "Unable to load nominations.",
      { cause: error },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request))
    return failureResponse(
      "POST",
      403,
      "origin_rejected",
      "This nomination request was not accepted.",
    );
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return failureResponse(
      "POST",
      415,
      "invalid_content_type",
      "Invalid request format.",
    );
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return failureResponse(
      "POST",
      413,
      "body_too_large",
      "Request is too large.",
    );
  }

  let ballotId: string | null;
  try {
    ballotId = readAwardsBallot(request);
  } catch (error) {
    return failureResponse(
      "POST",
      503,
      "ballot_validation_failed",
      "Nominations are temporarily unavailable.",
      { cause: error },
    );
  }
  if (!ballotId) {
    return failureResponse(
      "POST",
      400,
      "ballot_missing",
      "Please refresh the page before submitting a nomination.",
    );
  }

  try {
    const campaignStatus = getAwardsCampaignStatus();
    if (campaignStatus !== "open") {
      return failureResponse(
        "POST",
        403,
        `campaign_${campaignStatus}`,
        campaignMessage(campaignStatus) ?? "Nominations are unavailable.",
      );
    }
    if (await enforceSubmissionRateLimit(request)) {
      return failureResponse(
        "POST",
        429,
        "rate_limited",
        "Too many requests. Please try again shortly.",
        { retryAfter: 60 },
      );
    }
    const botCheck = await checkBotId();
    if (botCheck.isBot) {
      return failureResponse(
        "POST",
        403,
        "bot_rejected",
        "We could not verify this nomination. Please try again.",
      );
    }
  } catch (error) {
    return failureResponse(
      "POST",
      503,
      "verification_failed",
      "Nominations are temporarily unavailable.",
      { cause: error },
    );
  }

  let body: unknown;
  try {
    body = await parseJsonBody(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return failureResponse(
        "POST",
        413,
        "body_too_large",
        "Request is too large.",
      );
    }
    return failureResponse("POST", 400, "invalid_json", "Invalid JSON body.");
  }

  if (!isRecord(body)) {
    return failureResponse(
      "POST",
      400,
      "invalid_json_shape",
      "Invalid JSON body.",
    );
  }

  const categoryId =
    typeof body.categoryId === "string" ? body.categoryId : null;
  const twitterHandle = handle(body.twitterHandle);
  if (!categoryId || !categoryIds.has(categoryId))
    return failureResponse(
      "POST",
      400,
      "invalid_category",
      "Unknown award category.",
    );
  if (!twitterHandle)
    return failureResponse(
      "POST",
      400,
      "invalid_username",
      "Check the spelling and enter a valid X username (up to 15 letters, numbers, or underscores).",
    );

  try {
    const ipHash = hashIp(clientIp(request));
    const country = clientCountry(request);
    const { nomination } = await awardsPrisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.upsert({
          where: { browserUuid: ballotId },
          create: { browserUuid: ballotId, ipHash, country },
          update: {
            ...(ipHash ? { ipHash } : {}),
            ...(country ? { country } : {}),
          },
        });
        const existingNomination = await tx.nomination.findUnique({
          where: { userId_category: { userId: user.id, category: categoryId } },
          select: { id: true },
        });
        const nomination = await tx.nomination.upsert({
          where: { userId_category: { userId: user.id, category: categoryId } },
          create: {
            userId: user.id,
            category: categoryId,
            twitterHandle,
            ipHash,
            country,
          },
          update: {
            twitterHandle,
            ipHash,
            country,
            submittedAt: new Date(),
          },
        });
        await tx.nominationAttempt.create({
          data: {
            userId: user.id,
            category: categoryId,
            twitterHandle,
            ipHash,
            country,
            action: existingNomination ? "updated" : "created",
          },
        });
        return { nomination };
      },
    );
    return NextResponse.json(
      {
        nomination: {
          category: nomination.category,
          twitterHandle: nomination.twitterHandle,
          submittedAt: nomination.submittedAt,
        },
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    return failureResponse(
      "POST",
      503,
      "save_failed",
      "Unable to save nomination.",
      { cause: error },
    );
  }
}
