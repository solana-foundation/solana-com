import { NextRequest, NextResponse } from "next/server";
import {
  getGrpcConfig,
  getGrpcMetricRows,
  parseGrpcQueryOptions,
} from "@/lib/grpc/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const config = getGrpcConfig();
  if (!config)
    return NextResponse.json(
      { error: "The gRPC benchmark is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const data = await getGrpcMetricRows(
      config,
      parseGrpcQueryOptions(request.nextUrl.searchParams),
      Date.now(),
      request.nextUrl.searchParams.get("connections") === "1",
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
    console.error("Failed to load gRPC benchmark data", error);
    return NextResponse.json(
      { error: "gRPC benchmark data is unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
