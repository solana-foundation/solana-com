import { NextRequest, NextResponse } from "next/server";
import {
  finishXSignIn,
  openXState,
  xCallbackUrl,
  xSessionCookie,
} from "@/lib/here-for/x-auth";
export const runtime = "nodejs";
const DEFAULT_RETURN = "/breakpoint/mutuals/add";
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  // State carries everything the callback needs, so it works even when X's
  // app opens it in a different browser from the one that started sign-in.
  const pending = openXState(params.get("state"));
  // Send people back to the public origin the callback is registered on, not
  // the deployment URL a proxied request.url carries.
  const back = (outcome: "ok" | "denied" | "error") => {
    const url = new URL(
      pending?.returnTo ?? DEFAULT_RETURN,
      new URL(xCallbackUrl()).origin,
    );
    if (outcome !== "ok") url.searchParams.set("x", outcome);
    const response = NextResponse.redirect(url);
    response.headers.set("Cache-Control", "no-store");
    return response;
  };
  if (params.get("error") === "access_denied") return back("denied");
  const code = params.get("code");
  if (!pending || !code) return back("error");
  try {
    const session = await finishXSignIn(code, pending.verifier);
    const response = back("ok");
    response.cookies.set(
      xSessionCookie.name,
      await xSessionCookie.value(session),
      xSessionCookie.options,
    );
    return response;
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "here_for_x_callback_failure",
        errorName: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : null,
      }),
    );
    return back("error");
  }
}
