// #region estimate
import {
  appendTransactionMessageInstruction,
  assertIsTransactionWithBlockhashLifetime,
  createClient,
  createTransactionMessage,
  estimateAndSetResourceLimitsFactory,
  estimateResourceLimitsFactory,
  fillTransactionMessageProvisoryResourceLimits,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  setTransactionMessagePriorityFeeLamports,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import { getTransferSolInstruction } from "@solana-program/system";

const sender = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();

const client = await createClient()
  .use(payer(sender))
  .use(
    solanaRpc({
      rpcUrl: "http://localhost:8899",
      rpcSubscriptionsUrl: "ws://localhost:8900",
    }),
  )
  .use(rpcAirdrop())
  .use(airdropPayer(lamports(1_000_000_000n)));

const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();

// The priority fee is a pricing decision that simulation cannot measure, so it
// is set directly. The two resource limits are measured below instead of
// guessed. The provisory fill writes placeholder limits so the message
// simulates at the same size it will be sent at.
const draftMessage = pipe(
  createTransactionMessage({ version: 1 }),
  (m) => setTransactionMessageFeePayerSigner(sender, m),
  (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
  (m) =>
    appendTransactionMessageInstruction(
      getTransferSolInstruction({
        source: sender,
        destination: recipient.address,
        amount: lamports(10_000_000n),
      }),
      m,
    ),
  (m) => setTransactionMessagePriorityFeeLamports(5_000n, m),
  fillTransactionMessageProvisoryResourceLimits,
);

// Simulation runs with both limits raised to the runtime maximum, so it cannot
// fail for want of the resources it is measuring.
const estimateAndSetResourceLimits = estimateAndSetResourceLimitsFactory(
  estimateResourceLimitsFactory({ rpc: client.rpc }),
);
const transactionMessage = await estimateAndSetResourceLimits(draftMessage, {
  commitment: "confirmed",
});

console.log("Compute unit limit:", transactionMessage.config?.computeUnitLimit);
console.log(
  "Loaded accounts data size limit:",
  transactionMessage.config?.loadedAccountsDataSizeLimit,
);

const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);
assertIsTransactionWithBlockhashLifetime(signedTransaction);

await sendAndConfirmTransactionFactory({
  rpc: client.rpc,
  rpcSubscriptions: client.rpcSubscriptions,
})(signedTransaction, { commitment: "confirmed" });

// The estimate is the exact cost of one simulated run, with nothing to spare.
// Add a margin before relying on it in production.
console.log(
  "Transaction Signature:",
  getSignatureFromTransaction(signedTransaction),
);
// #endregion estimate
