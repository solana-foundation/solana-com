// #region client
import {
  address,
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type TransactionSigner,
} from "@solana/kit";
import {
  findAssociatedTokenPda,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { rpc, USDC_DECIMALS, USDC_MINT } from "../checkout/config";
import {
  encodeHeader,
  NETWORK,
  X402_VERSION,
  type PaymentPayload,
  type PaymentRequired,
} from "./x402";

/**
 * fetch() that pays: on a 402 it signs a payment for the price and retries
 * with it in the X-PAYMENT header.
 */
export async function fetchWithPayment(
  url: string,
  options: { signer: TransactionSigner; maxAmount: bigint },
): Promise<Response> {
  const first = await fetch(url);
  if (first.status !== 402) return first;
  const header = await createPaymentHeader(
    (await first.json()) as PaymentRequired,
    options,
  );
  return fetch(url, { headers: { "X-PAYMENT": header } });
}

/**
 * Pick the USDC "exact" option from a 402 answer, refuse anything above
 * `maxAmount`, and sign a USDC transfer to `payTo`. Returns the X-PAYMENT
 * header value.
 */
export async function createPaymentHeader(
  { accepts }: PaymentRequired,
  options: { signer: TransactionSigner; maxAmount: bigint },
): Promise<string> {
  const option = accepts.find(
    (a) =>
      a.scheme === "exact" && a.network === NETWORK && a.asset === USDC_MINT,
  );
  if (!option) throw new Error("no supported payment option");
  const price = BigInt(option.maxAmountRequired);
  if (price > options.maxAmount) {
    throw new Error(
      `price ${price} is above maxAmount ${options.maxAmount}; not paying`,
    );
  }

  const [source] = await findAssociatedTokenPda({
    owner: options.signer.address,
    mint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  const [destination] = await findAssociatedTokenPda({
    owner: address(option.payTo),
    mint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(options.signer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getTransferCheckedInstruction({
            source,
            mint: USDC_MINT,
            destination,
            authority: options.signer,
            amount: price,
            decimals: USDC_DECIMALS,
          }),
        ],
        m,
      ),
  );
  const signed = await signTransactionMessageWithSigners(message);

  const payment: PaymentPayload = {
    x402Version: X402_VERSION,
    scheme: "exact",
    network: option.network,
    payload: { transaction: getBase64EncodedWireTransaction(signed) },
  };
  return encodeHeader(payment);
}
// #endregion client
