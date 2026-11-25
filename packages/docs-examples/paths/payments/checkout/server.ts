// #region server
// A framework-free Node.js server (node:http). The same handler body works in
// Express, Fastify or Hono: read the signature, verify it, mark it used.
import { createServer, type IncomingMessage } from "node:http";
import { signature as toSignature } from "@solana/kit";
import { USDC_MINT } from "./config";
import { getOrder, isSignatureUsed, markPaidOnce } from "./orders";
import { verifyPayment } from "./verify-payment";

export function createCheckoutServer() {
  return createServer(async (req, res) => {
    const send = (status: number, body: unknown) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };
    try {
      await handle(req, send);
    } catch (err) {
      // A database or RPC failure: answer 500, keep the server running.
      console.error("confirm error", err);
      if (!res.headersSent)
        send(500, { error: "could not confirm payment, try again" });
    }
  });
}

async function handle(
  req: IncomingMessage,
  send: (status: number, body: unknown) => void,
) {
  const match = req.url?.match(/^\/api\/orders\/([^/]+)\/confirm$/);
  if (req.method !== "POST" || !match) return send(404, { error: "not found" });

  let orderId: string;
  try {
    orderId = decodeURIComponent(match[1]!);
  } catch {
    return send(400, { error: "invalid order id" });
  }
  const order = await getOrder(orderId);
  if (!order) return send(404, { error: "unknown order" });

  let raw = "";
  for await (const chunk of req) raw += chunk;
  let signature;
  try {
    signature = toSignature(
      (JSON.parse(raw) as { signature?: string }).signature ?? "",
    );
  } catch {
    return send(400, { error: "invalid signature" });
  }
  if (await isSignatureUsed(signature)) {
    return send(402, { paid: false, reason: "already used" });
  }

  const check = await verifyPayment({
    signature,
    storeOwner: order.storeOwner,
    mint: USDC_MINT,
    amount: order.amount,
    reference: order.reference,
  });
  if (!check.paid) return send(402, check);
  if (!(await markPaidOnce(order.id, signature))) {
    return send(402, { paid: false, reason: "already used" });
  }
  send(200, { paid: true, orderId: order.id, signature });
}
// #endregion server
