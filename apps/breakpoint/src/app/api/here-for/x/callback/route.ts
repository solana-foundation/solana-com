import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@workspace/i18n/config";
import { localizedRoutePath } from "@/config";
import {
  finishXSignIn,
  nonceMatches,
  openXState,
  sealXConfirm,
  stripAutoSave,
  xCallbackUrl,
  xNonceCookie,
  xReturnCookie,
  xSessionCookie,
} from "@/lib/here-for/x-auth";
export const runtime = "nodejs";
const DEFAULT_RETURN = "/breakpoint/mutuals/add";

/** The locale a validated mutuals return path lives under. */
function localeOf(returnTo: string) {
  const first = returnTo.split("/")[1] ?? "";
  return locales.includes(first as (typeof locales)[number])
    ? first
    : defaultLocale;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  // State carries everything the callback needs, so it works even when X's
  // app opens it in a different browser from the one that started sign-in.
  const pending = openXState(params.get("state"));
  const origin = new URL(xCallbackUrl()).origin;
  // Send people back to the public origin the callback is registered on, not
  // the deployment URL a proxied request.url carries.
  const back = (outcome: "ok" | "denied" | "error") => {
    const url = new URL(pending?.returnTo ?? DEFAULT_RETURN, origin);
    if (outcome !== "ok") url.searchParams.set("x", outcome);
    const response = NextResponse.redirect(url);
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(xNonceCookie.name, "", {
      ...xNonceCookie.options,
      maxAge: 0,
    });
    return response;
  };
  if (params.get("error") === "access_denied") return back("denied");
  const code = params.get("code");
  if (!pending || !code) return back("error");
  // A browser that holds a nonce cookie must be the one that started this
  // exact sign-in; a mismatch means a forwarded or stale callback URL.
  const cookieNonce = request.cookies.get(xNonceCookie.name)?.value;
  if (cookieNonce !== undefined && !nonceMatches(cookieNonce, pending.nonce)) {
    return back("error");
  }
  try {
    const session = await finishXSignIn(code, pending.verifier);
    if (cookieNonce === undefined) {
      // No proof this browser started sign-in: ask before signing it in, and
      // never auto-submit picks on this path.
      const url = new URL(
        localizedRoutePath(localeOf(pending.returnTo), "/mutuals/confirm"),
        origin,
      );
      url.searchParams.set(
        "token",
        sealXConfirm(session, stripAutoSave(pending.returnTo)),
      );
      const response = NextResponse.redirect(url);
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    const response = back("ok");
    response.cookies.set(
      xSessionCookie.name,
      await xSessionCookie.value(session),
      xSessionCookie.options,
    );
    response.cookies.set(
      xReturnCookie.name,
      xReturnCookie.value,
      xReturnCookie.options,
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
