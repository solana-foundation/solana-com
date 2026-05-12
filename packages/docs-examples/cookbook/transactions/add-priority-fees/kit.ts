// #region priority
import {
  airdropFactory,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  estimateComputeUnitLimitFactory,
  getSignatureFromTransaction,
  lamports,
  pipe,
  prependTransactionMessageInstructions,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";

import { getAddMemoInstruction } from "@solana-program/memo";

// Create an RPC
const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

// Create utility functions
const airdrop = airdropFactory({ rpc, rpcSubscriptions });
const getComputeUnitEstimate = estimateComputeUnitLimitFactory({ rpc });
const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});

// Create and fund an account
const keypairSigner = await generateKeyPairSigner();

await airdrop({
  commitment: "confirmed",
  lamports: lamports(1_000_000n),
  recipientAddress: keypairSigner.address,
});

// Create a memo transaction
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
const transactionMessage = pipe(
  createTransactionMessage({ version: "legacy" }),
  (m) => setTransactionMessageFeePayerSigner(keypairSigner, m),
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

// Estimate compute units for this transaction
const estimatedComputeUnits = await getComputeUnitEstimate(transactionMessage);
console.log(
  `Transaction is estimated to consume ${estimatedComputeUnits} compute units`,
);

// Add compute unit limit instruction to the transaction
const budgetedTransactionMessage = prependTransactionMessageInstructions(
  [getSetComputeUnitLimitInstruction({ units: estimatedComputeUnits })],
  transactionMessage,
);

// Sign and send the transaction
const signedTx = await signTransactionMessageWithSigners(
  budgetedTransactionMessage,
);
assertIsTransactionWithBlockhashLifetime(signedTx);
const transactionSignature = getSignatureFromTransaction(signedTx);
await sendAndConfirmTransaction(signedTx, { commitment: "confirmed" });
console.log(`Transaction Signature: ${transactionSignature}`);
// #endregion priority
