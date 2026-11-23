/**
 * The demo's API routes are only ever called by the demo page itself, so a
 * request from another site (or a plain cross-site form/script) is refused.
 *
 * Browsers send `sec-fetch-site` on every request and `origin` on every POST.
 * A same-origin `sec-fetch-site` is accepted on its own because same-origin
 * GETs carry no `origin` header (the preview deployment reads the RPC route
 * with GET, see lib/delivery-vs-payment/solana/rpc.ts). Otherwise `origin`
 * must match the request's own origin. Callers with neither header are
 * refused, which keeps the keyed devnet RPC from becoming a public proxy.
 */
export function isSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "same-origin") return true;
  if (fetchSite && fetchSite !== "none") return false;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function crossOriginResponse() {
  return Response.json(
    { error: "Cross-origin requests are not allowed." },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}
