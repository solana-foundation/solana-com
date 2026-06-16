// #region sign
import { createMemorySignerFromBytes } from "@solana/keychain-memory";
import {
  appendTransactionMessageInstruction,
  createSolanaRpc,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

// Create a Keychain signer. Swap `createMemorySignerFromBytes` for any backend
// (AWS KMS, Vault, Fireblocks, Turnkey, ...) and the signing code below is the
// same — every backend returns the same `SolanaSigner` interface.
const signer = await createMemorySignerFromBytes(
  crypto.getRandomValues(new Uint8Array(32)),
);

const recipient = await generateKeyPairSigner();

const rpc = createSolanaRpc("http://localhost:8899");
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (m) => setTransactionMessageFeePayerSigner(signer, m),
  (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
  (m) =>
    appendTransactionMessageInstruction(
      getTransferSolInstruction({
        source: signer,
        destination: recipient.address,
        amount: lamports(10_000_000n),
      }),
      m,
    ),
);

const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);
console.log("Signature:", getSignatureFromTransaction(signedTransaction));
// #endregion sign
