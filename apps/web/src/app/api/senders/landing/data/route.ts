import { NextRequest, NextResponse } from "next/server";
import {
  getSendLandingConfig,
  getSendLandingData,
  parseSendLandingQueryOptions,
} from "@/lib/send-landing/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const config = getSendLandingConfig();
  if (!config)
    return NextResponse.json(
      { error: "The send benchmark is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const data = await getSendLandingData(
      config,
      parseSendLandingQueryOptions(request.nextUrl.searchParams),
    );
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          process.env.NODE_ENV === "production"
            ? "public, max-age=0, s-maxage=60, stale-while-revalidate=300"
            : "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to load send benchmark data", error);
    return NextResponse.json(
      { error: "Send benchmark data is unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
