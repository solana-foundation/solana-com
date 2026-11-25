// #region route
// app/api/orders/[orderId]/confirm/route.ts (Next.js App Router)
import { signature as toSignature } from "@solana/kit";
import { USDC_MINT } from "./config";
import { getOrder, isSignatureUsed, markPaidOnce } from "./orders";
import { verifyPayment } from "./verify-payment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) return Response.json({ error: "unknown order" }, { status: 404 });

  let signature;
  try {
    const body = (await request.json()) as { signature?: string } | null;
    signature = toSignature(body?.signature ?? "");
  } catch {
    return Response.json({ error: "invalid signature" }, { status: 400 });
  }
  if (await isSignatureUsed(signature)) {
    return Response.json(
      { paid: false, reason: "already used" },
      { status: 402 },
    );
  }

  const check = await verifyPayment({
    signature,
    storeOwner: order.storeOwner,
    mint: USDC_MINT,
    amount: order.amount,
    reference: order.reference,
  });
  if (!check.paid) return Response.json(check, { status: 402 });

  if (!(await markPaidOnce(order.id, signature))) {
    return Response.json(
      { paid: false, reason: "already used" },
      { status: 402 },
    );
  }
  return Response.json({ paid: true, orderId: order.id, signature });
}
// #endregion route
