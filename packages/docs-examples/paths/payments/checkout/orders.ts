// #region orders
// An in-memory order store standing in for your database. A real store
// persists orders and paid signatures.
import type { Address, Signature } from "@solana/kit";

export interface Order {
  id: string;
  storeOwner: Address;
  amount: bigint;
  reference: Address;
}

const orders = new Map<string, Order>();
const paidSignatures = new Set<string>();
const paidOrders = new Map<string, Signature>();

export async function createOrder(order: Order): Promise<Order> {
  orders.set(order.id, order);
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return orders.get(id);
}

/**
 * Marks the order paid by this signature. Returns false (and records
 * nothing) if the signature was already used for any order, or if the order
 * is unknown or already paid by another signature. In a database, do this in
 * one transaction with unique constraints on the signature and on the order's
 * paid signature, so two concurrent requests cannot both succeed.
 */
export async function markPaidOnce(
  orderId: string,
  signature: Signature,
): Promise<boolean> {
  if (paidSignatures.has(signature)) return false;
  if (!orders.has(orderId) || paidOrders.has(orderId)) return false;
  paidSignatures.add(signature);
  paidOrders.set(orderId, signature);
  return true;
}

export async function isSignatureUsed(signature: Signature): Promise<boolean> {
  return paidSignatures.has(signature);
}
// #endregion orders
