/**
 * Test helpers for the checkout recordings. They call the code shown on the
 * pages; `confirm` prints each call's result the way the terminal panel on
 * the backend page shows it.
 */
import { generateKeyPairSigner, type Address } from "@solana/kit";
import { createOrder, type Order } from "./orders";
import { POST } from "./route";

export async function newOrder(
  id: string,
  storeOwner: Address,
  amount: bigint,
): Promise<Order> {
  const reference = (await generateKeyPairSigner()).address;
  return createOrder({ id, storeOwner, amount, reference });
}

/** The Next.js confirm route, called with a Request. */
export async function confirm(orderId: string, signature: string) {
  const res = await POST(
    new Request(`http://localhost/api/orders/${orderId}/confirm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ signature }),
    }),
    { params: Promise.resolve({ orderId }) },
  );
  const body = await res.json();
  console.log(
    `POST /api/orders/${orderId}/confirm ->`,
    res.status,
    JSON.stringify(body),
  );
  return { status: res.status, body };
}
