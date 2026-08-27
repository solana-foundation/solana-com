// #region versioned-transaction-alt
import {
  AddressLookupTableProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");
const payer = Keypair.generate();
const recipient = Keypair.generate();

const airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  LAMPORTS_PER_SOL,
);
const { blockhash, lastValidBlockHeight } =
  await connection.getLatestBlockhash();
await connection.confirmTransaction({
  blockhash,
  lastValidBlockHeight,
  signature: airdropSignature,
});

// Create the lookup table. Its address is derived from the authority and slot.
const recentSlot = await connection.getSlot("finalized");
const [createLookupTableInstruction, lookupTableAddress] =
  AddressLookupTableProgram.createLookupTable({
    authority: payer.publicKey,
    payer: payer.publicKey,
    recentSlot,
  });

await sendAndConfirmTransaction(
  connection,
  new Transaction().add(createLookupTableInstruction),
  [payer],
);

// Store addresses that do not need to sign the v0 transaction in the table.
const extendLookupTableInstruction =
  AddressLookupTableProgram.extendLookupTable({
    authority: payer.publicKey,
    payer: payer.publicKey,
    lookupTable: lookupTableAddress,
    addresses: [recipient.publicKey],
  });

await sendAndConfirmTransaction(
  connection,
  new Transaction().add(extendLookupTableInstruction),
  [payer],
);

const lookupTableAccount = (
  await connection.getAddressLookupTable(lookupTableAddress)
).value;
if (!lookupTableAccount) {
  throw new Error("Lookup table was not found");
}

// Addresses added to a table become usable in the slot after they are added.
while (
  (await connection.getSlot("confirmed")) <=
  lookupTableAccount.state.lastExtendedSlot
) {
  await new Promise((resolve) => setTimeout(resolve, 400));
}

const transferInstruction = SystemProgram.transfer({
  fromPubkey: payer.publicKey,
  toPubkey: recipient.publicKey,
  lamports: 1_000_000,
});
const transactionLifetime = await connection.getLatestBlockhash();

// Passing the table to compileToV0Message replaces eligible 32-byte addresses
// with 1-byte lookup indexes in the serialized transaction.
const message = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: transactionLifetime.blockhash,
  instructions: [transferInstruction],
}).compileToV0Message([lookupTableAccount]);

const transaction = new VersionedTransaction(message);
transaction.sign([payer]);

const signature = await connection.sendTransaction(transaction);
await connection.confirmTransaction({ ...transactionLifetime, signature });
console.log("Transaction signature:", signature);
// #endregion versioned-transaction-alt
