// #region pay
import {
  AccountRole,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Address,
  type TransactionSigner,
} from "@solana/kit";
import {
  findAssociatedTokenPda,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { rpc, rpcSubscriptions, USDC_DECIMALS, USDC_MINT } from "./config";

const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});

/**
 * The customer pays `amount` USDC base units (1 USDC = 1_000_000) to the
 * store's USDC token account. `reference` is a fresh address for this order,
 * added as a read-only account so the backend can tell which order a
 * transaction pays for (the Solana Pay convention).
 */
export async function payStore(
  customer: TransactionSigner,
  order: { storeOwner: Address; amount: bigint; reference: Address },
) {
  const [source] = await findAssociatedTokenPda({
    owner: customer.address,
    mint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  const [destination] = await findAssociatedTokenPda({
    owner: order.storeOwner,
    mint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const transfer = getTransferCheckedInstruction({
    source,
    mint: USDC_MINT,
    destination,
    authority: customer,
    amount: order.amount,
    decimals: USDC_DECIMALS,
  });
  const transferWithReference = {
    ...transfer,
    accounts: [
      ...transfer.accounts,
      { address: order.reference, role: AccountRole.READONLY },
    ],
  };

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(customer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions([transferWithReference], m),
  );
  const transaction = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(transaction);
  await sendAndConfirmTransaction(transaction, { commitment: "confirmed" });
  return getSignatureFromTransaction(transaction);
}
// #endregion pay
