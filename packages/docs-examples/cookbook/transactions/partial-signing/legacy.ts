// #region partial-signing
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import nacl from "tweetnacl";

const connection = new Connection("http://localhost:8899", "confirmed");
const feePayer = Keypair.generate();
const sender = Keypair.generate();
const recipient = Keypair.generate();

const feePayerAirdrop = await connection.requestAirdrop(
  feePayer.publicKey,
  LAMPORTS_PER_SOL,
);
const feePayerAirdropLifetime = await connection.getLatestBlockhash();
await connection.confirmTransaction({
  ...feePayerAirdropLifetime,
  signature: feePayerAirdrop,
});

const senderAirdrop = await connection.requestAirdrop(
  sender.publicKey,
  LAMPORTS_PER_SOL,
);
const senderAirdropLifetime = await connection.getLatestBlockhash();
await connection.confirmTransaction({
  ...senderAirdropLifetime,
  signature: senderAirdrop,
});

// Agree on every message field before asking anyone to sign.
const lifetime = await connection.getLatestBlockhash();
const transaction = new Transaction({
  feePayer: feePayer.publicKey,
  blockhash: lifetime.blockhash,
  lastValidBlockHeight: lifetime.lastValidBlockHeight,
}).add(
  SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 100_000_000,
  }),
);

// These exact bytes are the frozen message distributed to every signer.
const messageBytes = transaction.serializeMessage();

// Each party can sign the same bytes independently, including offline.
const feePayerSignature = nacl.sign.detached(messageBytes, feePayer.secretKey);
const senderSignature = nacl.sign.detached(messageBytes, sender.secretKey);

// Verify each signature before attaching it to the transaction.
if (
  !nacl.sign.detached.verify(
    messageBytes,
    feePayerSignature,
    feePayer.publicKey.toBytes(),
  )
) {
  throw new Error("Invalid fee payer signature");
}
if (
  !nacl.sign.detached.verify(
    messageBytes,
    senderSignature,
    sender.publicKey.toBytes(),
  )
) {
  throw new Error("Invalid sender signature");
}

// The coordinator merges signatures by their required signer address.
transaction.addSignature(feePayer.publicKey, Buffer.from(feePayerSignature));
transaction.addSignature(sender.publicKey, Buffer.from(senderSignature));

if (!transaction.verifySignatures()) {
  throw new Error("The transaction does not have valid required signatures");
}

const signature = await connection.sendRawTransaction(transaction.serialize());
await connection.confirmTransaction({ ...lifetime, signature });
console.log("Transaction signature:", signature);

// Any message mutation invalidates every signature already collected.
const mutatedTransaction = Transaction.from(transaction.serialize());
mutatedTransaction.add(
  SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 1,
  }),
);
console.log("Signatures still valid:", mutatedTransaction.verifySignatures());
// #endregion partial-signing
