// #region build
import {
  appendTransactionMessageInstruction,
  assertIsTransactionWithBlockhashLifetime,
  createClient,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageConfig,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
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

// A v1 message is assembled through the same pipeline as a legacy or v0 one.
// The difference is the config: a v1 transaction carries its resource limits in
// the message itself, so no ComputeBudget instructions are compiled in.
const transactionMessage = pipe(
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
  // The compute unit limit and loaded accounts data size limit both default to
  // zero on v1, so a transaction that leaves them unset always fails. The
  // priority fee is an absolute total in lamports, not a price per compute
  // unit.
  (m) =>
    setTransactionMessageConfig(
      {
        computeUnitLimit: 20_000,
        loadedAccountsDataSizeLimit: 64 * 1024,
        priorityFeeLamports: 5_000n,
      },
      m,
    ),
);

const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);
assertIsTransactionWithBlockhashLifetime(signedTransaction);

await sendAndConfirmTransactionFactory({
  rpc: client.rpc,
  rpcSubscriptions: client.rpcSubscriptions,
})(signedTransaction, { commitment: "confirmed" });

const transactionSignature = getSignatureFromTransaction(signedTransaction);
console.log("Transaction Signature:", transactionSignature);
// #endregion build

// #region read
import {
  decompileTransactionMessage,
  getBase64Encoder,
  getCompiledTransactionMessageDecoder,
  getTransactionDecoder,
} from "@solana/kit";

// Reading a v1 transaction requires opting in. The integer 1 is mandatory:
// omitting the parameter, or passing 0, fails on a v1 transaction rather than
// returning it in a degraded form.
const fetched = await client.rpc
  .getTransaction(transactionSignature, {
    commitment: "confirmed",
    encoding: "base64",
    maxSupportedTransactionVersion: 1,
  })
  .send();
if (fetched === null) {
  throw new Error("the transaction just sent was not found");
}

// The compiled message stores the config as a bitmask plus a positional list,
// so it is decompiled to address the fields by name. Decompiling fetches no
// accounts, because v1 does not support address lookup tables.
const wireTransaction = getBase64Encoder().encode(fetched.transaction[0]);
const transaction = getTransactionDecoder().decode(wireTransaction);
const compiledMessage = getCompiledTransactionMessageDecoder().decode(
  transaction.messageBytes,
);
const message = decompileTransactionMessage(compiledMessage);

console.log("Version:", message.version);
if ("config" in message) {
  // Scanning the instruction list for ComputeBudget instructions finds nothing
  // here — on v1 the limits live in the config.
  console.log("Compute unit limit:", message.config?.computeUnitLimit);
  console.log("Priority fee (lamports):", message.config?.priorityFeeLamports);
}
// #endregion read
