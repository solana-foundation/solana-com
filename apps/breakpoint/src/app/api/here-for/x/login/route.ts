import { NextRequest, NextResponse } from "next/server";
import {
  safeReturnPath,
  startXSignIn,
  xCallbackUrl,
  xRequestCookie,
} from "@/lib/here-for/x-auth";
export const runtime = "nodejs";
const DEFAULT_RETURN = "/breakpoint/mutuals/add";
export async function GET(request: NextRequest) {
  const returnTo =
    safeReturnPath(request.nextUrl.searchParams.get("return")) ??
    DEFAULT_RETURN;
  try {
    const { token, secret, authorizeUrl } = await startXSignIn();
    const response = NextResponse.redirect(authorizeUrl);
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(
      xRequestCookie.name,
      xRequestCookie.value(token, secret, returnTo),
      xRequestCookie.options,
    );
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
