// #region durable-nonce
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  assertIsTransactionWithDurableNonceLifetime,
  createClient,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  type Nonce,
  pipe,
  sendAndConfirmDurableNonceTransactionFactory,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  setTransactionMessageLifetimeUsingDurableNonce,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import {
  fetchNonce,
  getCreateAccountInstruction,
  getInitializeNonceAccountInstruction,
  getNonceSize,
  getTransferSolInstruction,
  SYSTEM_PROGRAM_ADDRESS,
} from "@solana-program/system";

const feePayer = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();
const nonceAccount = await generateKeyPairSigner();

const client = await createClient()
  .use(payer(feePayer))
  .use(
    solanaRpc({
      rpcUrl: "http://localhost:8899",
      rpcSubscriptionsUrl: "ws://localhost:8900",
    }),
  )
  .use(rpcAirdrop())
  .use(airdropPayer(lamports(1_000_000_000n)));

// Create and initialize the nonce account with a normal recent blockhash.
const nonceAccountSize = BigInt(getNonceSize());
const nonceAccountRent = await client.rpc
  .getMinimumBalanceForRentExemption(nonceAccountSize)
  .send();
const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();

const createNonceMessage = pipe(
  createTransactionMessage({ version: "legacy" }),
  (message) => setTransactionMessageFeePayerSigner(feePayer, message),
  (message) =>
    setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
  (message) =>
    appendTransactionMessageInstructions(
      [
        getCreateAccountInstruction({
          payer: feePayer,
          newAccount: nonceAccount,
          lamports: nonceAccountRent,
          space: nonceAccountSize,
          programAddress: SYSTEM_PROGRAM_ADDRESS,
        }),
        getInitializeNonceAccountInstruction({
          nonceAccount: nonceAccount.address,
          nonceAuthority: feePayer.address,
        }),
      ],
      message,
    ),
);

const createNonceTransaction =
  await signTransactionMessageWithSigners(createNonceMessage);
assertIsTransactionWithBlockhashLifetime(createNonceTransaction);
await sendAndConfirmTransactionFactory({
  rpc: client.rpc,
  rpcSubscriptions: client.rpcSubscriptions,
})(createNonceTransaction, { commitment: "confirmed" });

// Fetch the stored nonce, then use it instead of a recent blockhash.
const { data: nonceData } = await fetchNonce(client.rpc, nonceAccount.address);
const transferInstruction = getTransferSolInstruction({
  source: feePayer,
  destination: recipient.address,
  amount: lamports(1_000_000n),
});

const durableNonceMessage = pipe(
  createTransactionMessage({ version: "legacy" }),
  (message) => setTransactionMessageFeePayerSigner(feePayer, message),
  (message) =>
    setTransactionMessageLifetimeUsingDurableNonce(
      {
        nonce: nonceData.blockhash as string as Nonce,
        nonceAccountAddress: nonceAccount.address,
        nonceAuthorityAddress: nonceData.authority,
      },
      message,
    ),
  (message) =>
    appendTransactionMessageInstructions([transferInstruction], message),
);

const durableNonceTransaction =
  await signTransactionMessageWithSigners(durableNonceMessage);
assertIsTransactionWithDurableNonceLifetime(durableNonceTransaction);

await sendAndConfirmDurableNonceTransactionFactory({
  rpc: client.rpc,
  rpcSubscriptions: client.rpcSubscriptions,
})(durableNonceTransaction, { commitment: "confirmed" });

console.log(
  "Transaction signature:",
  getSignatureFromTransaction(durableNonceTransaction),
);
// #endregion durable-nonce
