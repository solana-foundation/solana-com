import { NextRequest, NextResponse } from "next/server";
import { awardCategories } from "@/content/awards";
import { awardsPrisma } from "@/lib/awards-db";

const MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const requests = new Map<string, { count: number; resetAt: number }>();
const categoryIds = new Set(awardCategories.map((category) => category.id));

type NominationBody = {
  categoryId?: unknown;
  twitterHandle?: unknown;
  userId?: unknown;
};

function clientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function clientCountry(request: NextRequest) {
  const country = request.headers.get("cf-ipcountry");
  return country && /^[a-z]{2}$/i.test(country) ? country.toUpperCase() : null;
}

function isAllowed(ip: string) {
  const now = Date.now();
  const current = requests.get(ip);
  if (!current || now >= current.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

function handle(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/^@+/, "").toLowerCase();
  return /^[a-z0-9_]{1,15}$/i.test(normalized) ? `@${normalized}` : null;
}

function userId(value: unknown) {
  return typeof value === "string" && /^[a-f0-9-]{36}$/i.test(value)
    ? value
    : null;
}

export async function GET(request: NextRequest) {
  const id = userId(new URL(request.url).searchParams.get("userId"));
  if (!id)
    return NextResponse.json(
      { error: "A valid userId is required." },
      { status: 400 },
    );

  try {
    const user = await awardsPrisma.user.findUnique({
      where: { browserUuid: id },
    });
    if (!user) return NextResponse.json({ nominations: [] });
    const nominations = await awardsPrisma.nomination.findMany({
      where: { userId: user.id },
      select: { category: true, twitterHandle: true, submittedAt: true },
      orderBy: { submittedAt: "desc" },
    });
    return NextResponse.json({ nominations });
  } catch (error) {
    console.error("Unable to fetch awards nominations", error);
    return NextResponse.json(
      { error: "Unable to load nominations." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (!isAllowed(ip))
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );

  let body: NominationBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const categoryId =
    typeof body.categoryId === "string" ? body.categoryId : null;
  const twitterHandle = handle(body.twitterHandle);
  const browserUuid = userId(body.userId);
  if (!categoryId || !categoryIds.has(categoryId))
    return NextResponse.json(
      { error: "Unknown award category." },
      { status: 400 },
    );
  if (!twitterHandle)
    return NextResponse.json(
      {
        error:
          "Enter a valid X username (up to 15 letters, numbers, or underscores).",
      },
      { status: 400 },
    );
  if (!browserUuid)
    return NextResponse.json(
      { error: "A valid userId is required." },
      { status: 400 },
    );

  try {
    const country = clientCountry(request);
    const user = await awardsPrisma.user.upsert({
      where: { browserUuid },
      create: { browserUuid, ipAddress: ip, country },
      update: { ...(country ? { country } : {}) },
    });
    const nomination = await awardsPrisma.nomination.upsert({
      where: { userId_category: { userId: user.id, category: categoryId } },
      create: {
        userId: user.id,
        category: categoryId,
        twitterHandle,
        ipAddress: ip,
        country,
      },
      update: {
        twitterHandle,
        ipAddress: ip,
        country,
        submittedAt: new Date(),
      },
    });
    return NextResponse.json({
      nomination: {
        category: nomination.category,
        twitterHandle: nomination.twitterHandle,
        submittedAt: nomination.submittedAt,
      },
    });
  } catch (error) {
    console.error("Unable to save awards nomination", error);
    return NextResponse.json(
      { error: "Unable to save nomination." },
      { status: 503 },
    );
  }
}
