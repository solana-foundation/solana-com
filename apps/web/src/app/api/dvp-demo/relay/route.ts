import { NextResponse } from "next/server";
import { relay } from "@/lib/delivery-vs-payment/server/solana";
import { allow, clientKey } from "@/lib/delivery-vs-payment/server/rateLimit";

export const runtime = "nodejs";

const PER_IP = { limit: 30, windowMs: 10 * 60 * 1000 };
const GLOBAL = { limit: 300, windowMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  if (
    !allow(`relay:${clientKey(request)}`, PER_IP.limit, PER_IP.windowMs) ||
    !allow("relay:global", GLOBAL.limit, GLOBAL.windowMs)
  ) {
    return NextResponse.json(
      { error: "Too many transactions; try again later." },
      { status: 429 },
    );
  }

  const { tx } = (await request.json()) as { tx?: string };
  if (!tx) {
    return NextResponse.json({ error: "Missing transaction" }, { status: 400 });
  }

  try {
    return NextResponse.json({ signature: await relay(tx) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Relay failed" },
      { status: 500 },
    );
  }
}
