import { NextRequest, NextResponse } from "next/server";
import {
  safeReturnPath,
  startXSignIn,
  xCallbackUrl,
} from "@/lib/here-for/x-auth";
export const runtime = "nodejs";
const DEFAULT_RETURN = "/breakpoint/mutuals/add";
export async function GET(request: NextRequest) {
  const returnTo =
    safeReturnPath(request.nextUrl.searchParams.get("return")) ??
    DEFAULT_RETURN;
  try {
    const response = NextResponse.redirect(startXSignIn(returnTo));
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "here_for_x_login_failure",
        errorName: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : null,
      }),
    );
    const url = new URL(returnTo, new URL(xCallbackUrl()).origin);
    url.searchParams.set("x", "error");
    return NextResponse.redirect(url);
  }
}
