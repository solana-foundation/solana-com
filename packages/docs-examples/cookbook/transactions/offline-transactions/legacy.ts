// #region sign
import {
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Message,
} from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";

// To complete an offline transaction:
// 1. Create Transaction
// 2. Sign Transaction
// 3. Recover Transaction
// 4. Send Transaction

// create connection
const connection = new Connection("http://localhost:8899", "confirmed");

// create an example tx, alice transfers to bob and feePayer is `feePayer`
// alice and feePayer are signers in this tx
const feePayer = Keypair.generate();
await connection.confirmTransaction(
  await connection.requestAirdrop(feePayer.publicKey, LAMPORTS_PER_SOL),
);
const alice = Keypair.generate();
await connection.confirmTransaction(
  await connection.requestAirdrop(alice.publicKey, LAMPORTS_PER_SOL),
);
const bob = Keypair.generate();

// 1. Create Transaction
let tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: alice.publicKey,
    toPubkey: bob.publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  }),
);
tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
tx.feePayer = feePayer.publicKey;
let realDataNeedToSign = tx.serializeMessage(); // the real data signers need to sign.

// 2. Sign Transaction
// use any lib you like, the main idea is to use ed25519 to sign it.
// the return signature should be 64 bytes.
let feePayerSignature = nacl.sign.detached(
  realDataNeedToSign,
  feePayer.secretKey,
);
let aliceSignature = nacl.sign.detached(realDataNeedToSign, alice.secretKey);

// 3. Recover Transaction

// you can verify signatures before recovering the transaction
let verifyFeePayerSignatureResult = nacl.sign.detached.verify(
  realDataNeedToSign,
  feePayerSignature,
  feePayer.publicKey.toBytes(), // raw pubkey (32 bytes) to verify
);
console.log(`verify feePayer signature: ${verifyFeePayerSignatureResult}`);

let verifyAliceSignatureResult = nacl.sign.detached.verify(
  realDataNeedToSign,
  aliceSignature,
  alice.publicKey.toBytes(),
);
console.log(`verify alice signature: ${verifyAliceSignatureResult}`);

// 3.a Recover Transaction (use populate then addSignature)
{
  let recoverTx = Transaction.populate(Message.from(realDataNeedToSign));
  recoverTx.addSignature(feePayer.publicKey, Buffer.from(feePayerSignature));
  recoverTx.addSignature(alice.publicKey, Buffer.from(aliceSignature));

  // 4. Send transaction
  console.log(
    `txhash: ${await connection.sendRawTransaction(recoverTx.serialize())}`,
  );
}

// 3.b Recover Transaction (use populate with signatures inline).
// Same outcome as 3.a — pick whichever style fits your code.
{
  let recoverTx = Transaction.populate(Message.from(realDataNeedToSign), [
    bs58.encode(feePayerSignature),
    bs58.encode(aliceSignature),
  ]);
  console.log(
    `recovered tx with ${recoverTx.signatures.length} signatures attached`,
  );
}

// if this process takes too long, your recent blockhash will expire (after 150 blocks).
// you can use `durable nonce` to get rid of it.
// #endregion sign
