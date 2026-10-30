// #region send
import { generateKeyPairSigner } from "@solana/kit";
import { client, tokenBalance, USDC_MINT } from "./client";

const wallet = client.identity;
if (Number(await tokenBalance(wallet.address)) < 1) {
  console.log(
    `No devnet USDC yet. Get some for ${wallet.address} at https://faucet.circle.com (pick Solana Devnet), then run this again.`,
  );
  process.exit(0);
}

// A brand-new address to pay. Any Solana address works here.
const { address: recipient } = await generateKeyPairSigner();

// Opens the recipient's USDC token account if needed, then moves 1 USDC
// (1,000,000 base units: USDC has 6 decimals) with TransferChecked.
const { context } = await client.token.instructions
  .transferToATA({
    mint: USDC_MINT,
    authority: wallet,
    recipient,
    amount: 1_000_000n,
    decimals: 6,
  })
  .sendTransaction();

console.log("Sent 1 USDC to", recipient);
console.log("Signature:", context.signature);
console.log(
  `Explorer: https://explorer.solana.com/tx/${context.signature}?cluster=devnet`,
);
console.log("Recipient balance:", await tokenBalance(recipient), "USDC");
// #endregion send
