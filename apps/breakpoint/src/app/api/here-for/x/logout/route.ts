import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin } from "@/lib/awards-abuse";
import { revokeXSession, xSessionCookie } from "@/lib/here-for/x-auth";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request))
    return NextResponse.json({ error: "origin_rejected" }, { status: 403 });
  try {
    await revokeXSession(request);
  } catch {
    return NextResponse.json(
      { error: "logout_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  const response = new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
  response.cookies.delete(xSessionCookie.name);
  return response;
}
