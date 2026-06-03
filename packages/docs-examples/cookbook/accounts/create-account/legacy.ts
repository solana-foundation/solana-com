// #region create
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

const fromKeypair = Keypair.generate();
const newAccount = Keypair.generate();

// Airdrop SOL for transferring lamports to the created account
const airdropSignature = await connection.requestAirdrop(
  fromKeypair.publicKey,
  LAMPORTS_PER_SOL,
);
await connection.confirmTransaction(airdropSignature);

// amount of space to reserve for the account
const space = 0;

// Seed the created account with lamports for rent exemption
const rentLamports = await connection.getMinimumBalanceForRentExemption(space);

const createAccountTransaction = new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey: fromKeypair.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: rentLamports,
    space,
    programId: SystemProgram.programId,
  }),
);

const signature = await sendAndConfirmTransaction(
  connection,
  createAccountTransaction,
  [fromKeypair, newAccount],
);

console.log("Transaction Signature:", signature);
// #endregion create
