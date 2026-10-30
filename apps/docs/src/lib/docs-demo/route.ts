import { checkBotId } from "botid/server";
import { allow, clientKey, ipKey } from "@/lib/docs-demo/rate-limit";
import {
  DemoCapped,
  demoConfigured,
  DemoUnconfigured,
  DemoUnfunded,
  sendDemo,
  type DemoKind,
  type DemoResult,
} from "./server";

/**
 * POST handler for one demo on "Solana in action": a real devnet
 * transaction (the checkout's USDC transfer, or a new token). Once it's
 * sent, the answer streams two NDJSON lines: `{ "step": "sent" }`, then
 * `{ signature, ms }` (plus `mint` for a token) once it's confirmed, or
 * `{ error: "failed" }`. Before then, an error is a plain JSON `{ error }`
 * with one of "rate-limited", "capped", "bot", "unconfigured", "unfunded",
 * or "failed". The scenes still play on an error; they just leave out the
 * Explorer link.
 *
 * Browser calls only: BotId (instrumentation-client.ts protects these paths)
 * plus in-memory limits per IP (IPv6 by /64) a minute and per instance an
 * hour, then the onchain daily cap across all instances (server.ts). BotId
 * runs on Vercel only; elsewhere (next start locally) the route answers "bot"
 * unless the wallets are missing, in which case it answers "unconfigured"
 * first.
 */
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const GLOBAL = { limit: 600, windowMs: HOUR };
const NO_STORE = { "Cache-Control": "no-store" };

function json(body: Record<string, string | number>, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

export function demoRoute(kind: DemoKind, perMinute: number) {
  return async function POST(request: Request): Promise<Response> {
    if (
      !allow(`demo:${kind}:${ipKey(clientKey(request))}`, perMinute, MINUTE) ||
      !allow("demo:global", GLOBAL.limit, GLOBAL.windowMs)
    ) {
      return json({ error: "rate-limited" }, 429);
    }
    if (!demoConfigured()) return json({ error: "unconfigured" }, 503);
    // Fail closed: off Vercel, or without its OIDC token, checkBotId throws.
    const human = await checkBotId().then(
      (r) => !r.isBot,
      () => false,
    );
    if (!human) return json({ error: "bot" }, 403);

    let sent = () => {};
    const isSent = new Promise<void>((r) => (sent = r));
    const result = sendDemo(kind, sent);
    try {
      await Promise.race([isSent, result]);
    } catch (error) {
      return failure(error);
    }
    const line = (body: object) =>
      new TextEncoder().encode(`${JSON.stringify(body)}\n`);
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(line({ step: "sent" }));
        controller.enqueue(
          line(
            await result.then(
              (r: DemoResult) => r,
              () => ({ error: "failed" }),
            ),
          ),
        );
        controller.close();
      },
    });
    return new Response(body, {
      headers: { ...NO_STORE, "Content-Type": "application/x-ndjson" },
    });
  };
}

function failure(error: unknown): Response {
  if (error instanceof DemoUnconfigured)
    return json({ error: "unconfigured" }, 503);
  if (error instanceof DemoCapped) return json({ error: "capped" }, 429);
  if (error instanceof DemoUnfunded) return json({ error: "unfunded" }, 503);
  // Never the error text: an RPC error can carry the keyed RPC URL.
  return json({ error: "failed" }, 502);
}
