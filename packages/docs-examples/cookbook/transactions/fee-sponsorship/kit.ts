// #region sponsor
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import {
  fetchToken,
  findAssociatedTokenPda,
  tokenProgram,
  TOKEN_PROGRAM_ADDRESS,
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

// Build a Kit client: fee payer (funded with 1 SOL), local RPC, and the token program plugin
const client = await createClient()
  .use(payer(feePayer))
  .use(
    solanaRpc({
      rpcUrl: "http://localhost:8899",
      rpcSubscriptionsUrl: "ws://localhost:8900",
    }),
  )
  .use(rpcAirdrop())
  .use(airdropPayer(lamports(1_000_000_000n)))
  .use(tokenProgram());

// Create the mint and mint 1.00 tokens to sender's ATA (the plugin auto-creates the ATA)
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

// Transfer 0.50 tokens from sender to recipient — fee paid by feePayer
const transferToRecipientIx = await client.token.instructions.transferToATA({
  mint: mint.address,
  authority: sender,
  recipient: recipient.address,
  amount: 50n,
  decimals: 2,
});

const transfer = await client.sendTransaction([transferToRecipientIx]);
console.log("Transaction Signature:", transfer.context.signature);
console.log("Successfully transferred 0.5 tokens");

// Verify final balances
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

const senderTokenAccount = await fetchToken(client.rpc, senderAta, {
  commitment: "confirmed",
});
const recipientTokenAccount = await fetchToken(client.rpc, recipientAta, {
  commitment: "confirmed",
});

console.log("=== Final Balances ===");
console.log(
  "Sender balance:",
  Number(senderTokenAccount.data.amount) / 100,
  "tokens",
);
console.log(
  "Recipient balance:",
  Number(recipientTokenAccount.data.amount) / 100,
  "tokens",
);
// #endregion sponsor
