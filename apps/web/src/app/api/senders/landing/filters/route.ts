import { NextResponse } from "next/server";
import {
  getSendLandingConfig,
  getSendLandingFilters,
} from "@/lib/send-landing/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = getSendLandingConfig();
  if (!config)
    return NextResponse.json(
      { error: "The send benchmark is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  try {
    return NextResponse.json(await getSendLandingFilters(config), {
      headers: {
        "Cache-Control":
          process.env.NODE_ENV === "production"
            ? "public, max-age=0, s-maxage=300, stale-while-revalidate=3600"
            : "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to load send benchmark filters", error);
    return NextResponse.json(
      { error: "Send benchmark filters are unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
