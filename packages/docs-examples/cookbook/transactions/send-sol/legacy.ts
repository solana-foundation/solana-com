// #region transfer
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const fromKeypair = Keypair.generate();
const toKeypair = Keypair.generate();

const connection = new Connection("http://localhost:8899", "confirmed");

const airdropSignature = await connection.requestAirdrop(
  fromKeypair.publicKey,
  LAMPORTS_PER_SOL,
);

await connection.confirmTransaction(airdropSignature);

const lamportsToSend = 1_000_000;

const transferTransaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey: toKeypair.publicKey,
    lamports: lamportsToSend,
  }),
);

const signature = await sendAndConfirmTransaction(
  connection,
  transferTransaction,
  [fromKeypair],
);
console.log("Transaction Signature:", signature);
// #endregion transfer
