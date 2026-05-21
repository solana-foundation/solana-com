// #region cost
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  compileTransactionMessage,
  createClient,
  createTransactionMessage,
  estimateComputeUnitLimitFactory,
  generateKeyPairSigner,
  getBase64Decoder,
  getCompiledTransactionMessageEncoder,
  getSignatureFromTransaction,
  lamports,
  pipe,
  prependTransactionMessageInstructions,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type TransactionMessageBytesBase64,
} from "@solana/kit";
import { solanaLocalRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";
import { getAddMemoInstruction } from "@solana-program/memo";

// 1. Spin up a client with localhost RPC, fund the payer.
const signer = await generateKeyPairSigner();
const client = await createClient()
  .use(payer(signer))
  .use(solanaLocalRpc())
  .use(airdropPayer(lamports(1_000_000_000n)));
console.log("Create and fund account with address", signer.address);

// 2. Build a memo transaction manually so we can inspect its fee before sending.
const getComputeUnitEstimate = estimateComputeUnitLimitFactory({
  rpc: client.rpc,
});

const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();
const transactionMessage = pipe(
  createTransactionMessage({ version: "legacy" }),
  (m) => setTransactionMessageFeePayerSigner(signer, m),
  (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
  (m) =>
    appendTransactionMessageInstructions(
      [
        getSetComputeUnitPriceInstruction({ microLamports: 5000n }),
        getAddMemoInstruction({ memo: "Hello, world!" }),
      ],
      m,
    ),
);

// 3. Estimate compute units and add a SetComputeUnitLimit instruction.
const estimatedComputeUnits = await getComputeUnitEstimate(transactionMessage);
console.log(
  `Transaction is estimated to consume ${estimatedComputeUnits} compute units`,
);

const budgetedTransactionMessage = prependTransactionMessageInstructions(
  [getSetComputeUnitLimitInstruction({ units: estimatedComputeUnits })],
  transactionMessage,
);

// 4. Calculate the transaction fee with getFeeForMessage.
const base64EncodedMessage = pipe(
  budgetedTransactionMessage,
  compileTransactionMessage,
  getCompiledTransactionMessageEncoder().encode,
  getBase64Decoder().decode,
) as TransactionMessageBytesBase64;

const transactionCost = await client.rpc
  .getFeeForMessage(base64EncodedMessage)
  .send();
console.log(
  "Transaction is estimated to cost " + transactionCost.value + " lamports",
);

// 5. Sign and send.
const signedTx = await signTransactionMessageWithSigners(
  budgetedTransactionMessage,
);
assertIsTransactionWithBlockhashLifetime(signedTx);
const transactionSignature = getSignatureFromTransaction(signedTx);
console.log("Transaction Signature:", transactionSignature);

await sendAndConfirmTransactionFactory({
  rpc: client.rpc,
  rpcSubscriptions: client.rpcSubscriptions,
})(signedTx, { commitment: "confirmed" });
// #endregion cost
