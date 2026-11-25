// #region verify
import type { Address, Signature } from "@solana/kit";
import { rpc } from "./config";

export type PaymentCheck = { paid: true } | { paid: false; reason: string };

/**
 * Confirm on your server that `signature` paid this order: the transaction
 * succeeded, it carries the order's reference, and the store's token account
 * for `mint` received exactly `amount` base units. Never trust the browser's
 * word for it.
 */
export async function verifyPayment(order: {
  signature: Signature;
  storeOwner: Address;
  mint: Address;
  amount: bigint;
  reference?: Address;
}): Promise<PaymentCheck> {
  const tx = await rpc
    .getTransaction(order.signature, {
      commitment: "confirmed",
      encoding: "jsonParsed",
      maxSupportedTransactionVersion: 0,
    })
    .send();
  if (!tx) return { paid: false, reason: "transaction not found" };
  if (tx.meta?.err) return { paid: false, reason: "transaction failed" };

  const keys = tx.transaction.message.accountKeys.map((k) => k.pubkey);
  if (order.reference && !keys.includes(order.reference)) {
    return { paid: false, reason: "reference not found" };
  }

  // What the store's token account for this mint held before and after.
  type TokenBalances = NonNullable<typeof tx.meta>["preTokenBalances"];
  const balance = (list: TokenBalances) =>
    BigInt(
      list?.find((b) => b.owner === order.storeOwner && b.mint === order.mint)
        ?.uiTokenAmount.amount ?? "0",
    );
  const received =
    balance(tx.meta?.postTokenBalances) - balance(tx.meta?.preTokenBalances);
  if (received !== order.amount) {
    return {
      paid: false,
      reason: `amount mismatch: expected ${order.amount}, received ${received}`,
    };
  }
  return { paid: true };
}
// #endregion verify
