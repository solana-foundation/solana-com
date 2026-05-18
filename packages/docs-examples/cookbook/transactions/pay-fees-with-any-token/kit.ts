// #region pay-fees
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { solanaLocalRpc } from "@solana/kit-plugin-rpc";
import { payer } from "@solana/kit-plugin-signer";
import {
  fetchToken,
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
  tokenProgram,
} from "@solana-program/token";

// Generate keypairs for fee payer, sender, recipient, and mint
const feePayer = await generateKeyPairSigner();
const sender = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();
const mint = await generateKeyPairSigner();

console.log("Fee Payer Address:", feePayer.address);
console.log("Sender Address:", sender.address);
console.log("Recipient Address:", recipient.address);
console.log("Mint Address:", mint.address);

// Build a Kit client: fee payer, local RPC + airdrop + planner + executor,
// and the token program plugin
const client = createClient()
  .use(payer(feePayer))
  .use(solanaLocalRpc())
  .use(tokenProgram());

// Fund fee payer
await client.airdrop(feePayer.address, lamports(1_000_000_000n));

// Create the mint and mint 1.00 tokens to sender's ATA
const createMintIx = client.token.instructions.createMint({
  newMint: mint,
  decimals: 2,
  mintAuthority: sender.address,
});
const mintToSenderIx = await client.token.instructions.mintToATA({
  mint: mint.address,
  owner: sender.address,
  mintAuthority: sender,
  amount: 100n,
  decimals: 2,
});

const setup = await client.sendTransaction([createMintIx, mintToSenderIx]);
console.log("Transaction Signature:", setup.context.signature);
console.log("Successfully minted 1.0 tokens");

// Derive the ATAs for fee payer, sender and recipient
const [senderAta] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: sender.address,
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});
const [recipientAta] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: recipient.address,
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});
const [feePayerAta] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: feePayer.address,
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});

// Transfer tokens to recipient
const transferToRecipientIx = await client.token.instructions.transferToATA({
  mint: mint.address,
  source: senderAta,
  authority: sender,
  recipient: recipient.address,
  amount: 50n,
  decimals: 2,
});

// Pay the fee payer in tokens to cover the transaction fees.
// For a real-world application, calculate this from the SOL fee.
const reimburseFeePayerIx = await client.token.instructions.transferToATA({
  mint: mint.address,
  source: senderAta,
  authority: sender,
  recipient: feePayer.address,
  amount: 50n,
  decimals: 2,
});

const transfer = await client.sendTransaction([
  transferToRecipientIx,
  reimburseFeePayerIx,
]);
console.log("Transaction Signature:", transfer.context.signature);
console.log(
  "Successfully transferred 0.5 tokens to recipient + 0.5 to fee payer",
);

// Final balances
const [feePayerAcct, senderAcct, recipientAcct] = await Promise.all([
  fetchToken(client.rpc, feePayerAta, { commitment: "confirmed" }),
  fetchToken(client.rpc, senderAta, { commitment: "confirmed" }),
  fetchToken(client.rpc, recipientAta, { commitment: "confirmed" }),
]);

console.log("=== Final Balances ===");
console.log(
  "Fee Payer balance:",
  Number(feePayerAcct.data.amount) / 100,
  "tokens",
);
console.log("Sender balance:", Number(senderAcct.data.amount) / 100, "tokens");
console.log(
  "Recipient balance:",
  Number(recipientAcct.data.amount) / 100,
  "tokens",
);
// #endregion pay-fees
