import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ASK_API_URL = process.env.ASK_API_URL;
const ASK_PROXY_SECRET = process.env.ASK_PROXY_SECRET;

// Vercel sets x-real-ip to the socket peer address, so it is the trustworthy
// identity; the x-forwarded-for chain can carry client-supplied entries, so
// only its last hop is believable. Same resolution order as the throttle in
// api/slot-time/stream/route.ts — taking the leftmost x-forwarded-for entry
// would let a caller spoof the header to dodge limits or burn another
// visitor's allowance. Forwarded as a dedicated single-value header so the
// agent's rightmost-entry parse reads exactly this one value.
function visitorIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  const xff = req.headers.get("x-forwarded-for");
  if (xff?.trim()) {
    const hops = xff.split(",");
    return hops[hops.length - 1].trim();
  }

  return "";
}

async function proxy(req: NextRequest, path: string[]) {
  if (!ASK_API_URL || !ASK_PROXY_SECRET) {
    return NextResponse.json(
      { error: "Docs search is not configured." },
      { status: 503 },
    );
  }

  const url = new URL(`/api/ask/${path.join("/")}`, ASK_API_URL);
  url.search = req.nextUrl.search;

  const headers = new Headers({
    "X-Ask-Proxy-Secret": ASK_PROXY_SECRET,
    accept: req.headers.get("accept") ?? "application/json",
  });

  const ip = visitorIp(req);
  if (ip) headers.set("X-Ask-Client-IP", ip);

  // Anonymous chat session token, when the widget holds one.
  const session = req.headers.get("x-ask-session");
  if (session) headers.set("X-Ask-Session", session);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  if (hasBody) {
    headers.set(
      "content-type",
      req.headers.get("content-type") ?? "application/json",
    );
  }

  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body: hasBody ? await req.text() : undefined,
    cache: "no-store",
  });

  // Pass the body straight through: JSON for search, and an unbuffered SSE
  // stream for chat, without reading it into memory.
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
