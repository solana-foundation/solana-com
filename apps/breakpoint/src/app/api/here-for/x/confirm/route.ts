import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin } from "@/lib/awards-abuse";
import {
  openXConfirm,
  xCallbackUrl,
  xSessionCookie,
} from "@/lib/here-for/x-auth";
export const runtime = "nodejs";
const DEFAULT_RETURN = "/breakpoint/mutuals/add";

/**
 * Finishes a sign-in that arrived in a browser other than the one that
 * started it. The identity was verified with X in the callback and sealed
 * into a two-minute token; the visitor confirms it from a same-origin form.
 */
export async function POST(request: NextRequest) {
  const origin = new URL(xCallbackUrl()).origin;
  const back = (path: string, outcome?: "error") => {
    const url = new URL(path, origin);
    if (outcome) url.searchParams.set("x", outcome);
    const response = NextResponse.redirect(url, 303);
    response.headers.set("Cache-Control", "no-store");
    return response;
  };
  if (!hasSameOrigin(request))
    return NextResponse.json({ error: "origin_rejected" }, { status: 403 });
  let token: string | null = null;
  try {
    const form = await request.formData();
    const value = form.get("token");
    token = typeof value === "string" ? value : null;
  } catch {
    token = null;
  }
  const confirmed = openXConfirm(token);
  if (!confirmed) return back(DEFAULT_RETURN, "error");
  try {
    const response = back(confirmed.returnTo);
    response.cookies.set(
      xSessionCookie.name,
      await xSessionCookie.value(confirmed.session),
      xSessionCookie.options,
    );
    return response;
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "here_for_x_confirm_failure",
        errorName: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : null,
      }),
    );
    return back(confirmed.returnTo, "error");
  }
}
