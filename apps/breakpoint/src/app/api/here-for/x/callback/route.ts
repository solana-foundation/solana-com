import { NextRequest, NextResponse } from "next/server";
import {
  finishXSignIn,
  readXRequest,
  xCallbackUrl,
  xRequestCookie,
  xSessionCookie,
} from "@/lib/here-for/x-auth";
export const runtime = "nodejs";
const DEFAULT_RETURN = "/breakpoint/mutuals/add";
export async function GET(request: NextRequest) {
  const pending = readXRequest(request);
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
    response.cookies.delete(xRequestCookie.name);
    return response;
  };
  const params = request.nextUrl.searchParams;
  if (params.has("denied")) return back("denied");
  const token = params.get("oauth_token");
  const verifier = params.get("oauth_verifier");
  if (!pending || !token || !verifier || token !== pending.token)
    return back("error");
  try {
    const session = await finishXSignIn(token, pending.secret, verifier);
    const response = back("ok");
    response.cookies.set(
      xSessionCookie.name,
      xSessionCookie.value(session),
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
