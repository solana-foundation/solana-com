import { NextRequest, NextResponse } from "next/server";
import {
  newXNonce,
  safeReturnPath,
  startXSignIn,
  xCallbackUrl,
  xNonceCookie,
} from "@/lib/here-for/x-auth";
export const runtime = "nodejs";
const DEFAULT_RETURN = "/breakpoint/mutuals/add";
export async function GET(request: NextRequest) {
  const returnTo =
    safeReturnPath(request.nextUrl.searchParams.get("return")) ??
    DEFAULT_RETURN;
  try {
    // The nonce travels both in the sealed state and in a cookie, so the
    // callback can tell the browser that started sign-in from any other.
    const nonce = newXNonce();
    const response = NextResponse.redirect(startXSignIn(returnTo, nonce));
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(xNonceCookie.name, nonce, xNonceCookie.options);
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
