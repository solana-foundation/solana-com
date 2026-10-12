/** Age of a sampled block when its HTTP response reaches the browser. */
export function blockAgeAtReceipt(
  serverTime: number,
  headers: Headers,
): number | null {
  const responseDate = Date.parse(headers.get("date") ?? "");
  if (!Number.isFinite(responseDate)) return null;

  // Date is the response's origin time; Age includes time spent in caches.
  const age = Number(headers.get("age") ?? 0);
  const cacheAgeMs = Number.isFinite(age) && age > 0 ? age * 1000 : 0;
  return Math.max(0, responseDate + cacheAgeMs - serverTime);
}
