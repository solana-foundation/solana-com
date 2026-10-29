import { NextResponse } from "next/server";
import { getGrpcConfig, getGrpcFilters } from "@/lib/grpc/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = getGrpcConfig();
  if (!config)
    return NextResponse.json(
      { error: "The gRPC benchmark is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  try {
    return NextResponse.json(await getGrpcFilters(config), {
      headers: {
        "Cache-Control":
          process.env.NODE_ENV === "production"
            ? "public, max-age=0, s-maxage=300, stale-while-revalidate=3600"
            : "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "gRPC benchmark filters are unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
