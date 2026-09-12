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

class RequestBodyTooLargeError extends Error {}

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
    console.error("Unable to initialize awards ballot", error);
    return NextResponse.json(
      { error: "Nominations are temporarily unavailable." },
      { status: 503, headers: NO_STORE_HEADERS },
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
    console.error("Unable to fetch awards nominations", error);
    return NextResponse.json(
      { error: "Unable to load nominations." },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request))
    return NextResponse.json(
      { error: "This nomination request was not accepted." },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json(
      { error: "Invalid request format." },
      { status: 415, headers: NO_STORE_HEADERS },
    );
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413, headers: NO_STORE_HEADERS },
    );
  }

  let ballotId: string | null;
  try {
    ballotId = readAwardsBallot(request);
  } catch (error) {
    console.error("Unable to validate awards ballot", error);
    return NextResponse.json(
      { error: "Nominations are temporarily unavailable." },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
  if (!ballotId) {
    return NextResponse.json(
      { error: "Please refresh the page before submitting a nomination." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const campaignStatus = getAwardsCampaignStatus();
    if (campaignStatus !== "open") {
      return NextResponse.json(
        { error: campaignMessage(campaignStatus) },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }
    if (await enforceSubmissionRateLimit(request)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { ...NO_STORE_HEADERS, "Retry-After": "60" } },
      );
    }
    const botCheck = await checkBotId();
    if (botCheck.isBot) {
      return NextResponse.json(
        { error: "We could not verify this nomination. Please try again." },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }
  } catch (error) {
    console.error("Unable to verify awards nomination request", error);
    return NextResponse.json(
      { error: "Nominations are temporarily unavailable." },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  let body: unknown;
  try {
    body = await parseJsonBody(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json(
        { error: "Request is too large." },
        { status: 413, headers: NO_STORE_HEADERS },
      );
    }
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (body.website)
    return NextResponse.json({ ok: true }, { headers: NO_STORE_HEADERS });

  const categoryId =
    typeof body.categoryId === "string" ? body.categoryId : null;
  const twitterHandle = handle(body.twitterHandle);
  if (!categoryId || !categoryIds.has(categoryId))
    return NextResponse.json(
      { error: "Unknown award category." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  if (!twitterHandle)
    return NextResponse.json(
      {
        error:
          "Enter a valid X username (up to 15 letters, numbers, or underscores).",
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );

  try {
    const ipAddress = clientIp(request);
    const ipHash = hashIp(ipAddress);
    const country = clientCountry(request);
    const { nomination } = await awardsPrisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.upsert({
          where: { browserUuid: ballotId },
          create: { browserUuid: ballotId, ipAddress, ipHash, country },
          update: {
            ...(ipAddress ? { ipAddress } : {}),
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
            ipAddress,
            ipHash,
            country,
          },
          update: {
            twitterHandle,
            ipAddress,
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
            ipAddress,
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
    console.error("Unable to save awards nomination", error);
    return NextResponse.json(
      { error: "Unable to save nomination." },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
}
