import { NextResponse } from "next/server";
import { address } from "@solana/kit";
import type { RoleKey } from "@/lib/delivery-vs-payment/config";
import { fundRoles } from "@/lib/delivery-vs-payment/server/solana";
import { allow, clientKey } from "@/lib/delivery-vs-payment/server/rateLimit";

export const runtime = "nodejs";

const PER_IP = { limit: 5, windowMs: 60 * 60 * 1000 };
const GLOBAL = { limit: 60, windowMs: 60 * 60 * 1000 };

export async function POST(request: Request) {
  if (
    !allow(`fund:${clientKey(request)}`, PER_IP.limit, PER_IP.windowMs) ||
    !allow("fund:global", GLOBAL.limit, GLOBAL.windowMs)
  ) {
    return NextResponse.json(
      { error: "Too many demo runs; try again later." },
      { status: 429 },
    );
  }

  const { addresses } = (await request.json()) as {
    addresses?: Record<RoleKey, string>;
  };

  if (
    !addresses?.maker ||
    !addresses.partyA ||
    !addresses.partyB ||
    !addresses.authority
  ) {
    return NextResponse.json(
      { error: "Missing role addresses" },
      { status: 400 },
    );
  }

  try {
    Object.values(addresses).forEach((value) => address(value));
    return NextResponse.json(await fundRoles(addresses));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Funding failed" },
      { status: 500 },
    );
  }
}
