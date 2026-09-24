import { NextResponse } from "next/server";
import { allow, clientKey } from "@/lib/delivery-vs-payment/server/rateLimit";

export const runtime = "nodejs";

const ALLOWED_METHODS = new Set([
  "getAccountInfo",
  "getBalance",
  "getLatestBlockhash",
  "getSignatureStatuses",
  "getTokenAccountBalance",
]);
const MAX_BODY_BYTES = 16 * 1024;
const PER_IP = { limit: 300, windowMs: 60_000 };
const GLOBAL = { limit: 1500, windowMs: 60_000 };

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function rpcError(id: unknown, code: number, message: string, status: number) {
  return NextResponse.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
    { status },
  );
}

export async function POST(request: Request) {
  const rpcUrl = process.env.SOLANA_RPC_URL;
  if (!rpcUrl) {
    return rpcError(null, -32000, "Demo RPC is not configured", 503);
  }
  if (
    !allow(`rpc:${clientKey(request)}`, PER_IP.limit, PER_IP.windowMs) ||
    !allow("rpc:global", GLOBAL.limit, GLOBAL.windowMs)
  ) {
    return rpcError(null, -32005, "Too many requests; slow down", 429);
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return rpcError(null, -32600, "Request body too large", 413);
  }

  let call: { id?: unknown; method?: unknown };
  try {
    call = JSON.parse(body);
  } catch {
    return rpcError(null, -32700, "Parse error", 400);
  }
  if (
    Array.isArray(call) ||
    typeof call !== "object" ||
    call === null ||
    typeof call.method !== "string" ||
    !ALLOWED_METHODS.has(call.method)
  ) {
    return rpcError(call?.id, -32601, "Method not allowed", 403);
  }

  let lastResponse: Response | null = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
    });
    if (response.status !== 429 && response.status < 500) {
      return new Response(await response.text(), {
        status: response.status,
        headers: { "content-type": "application/json" },
      });
    }
    lastResponse = response;
    await wait(250 * 2 ** attempt);
  }

  return new Response(await lastResponse?.text(), {
    status: lastResponse?.status ?? 502,
    headers: { "content-type": "application/json" },
  });
}
