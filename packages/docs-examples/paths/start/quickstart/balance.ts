// #region balance
import { client, tokenBalance } from "./client";

const wallet = client.identity.address;
console.log("Wallet:", wallet);

// Balances are in lamports: 1 SOL = 1,000,000,000 lamports.
const { value: before } = await client.rpc.getBalance(wallet).send();
if (before === 0n) {
  // A new wallet: ask solana.com's devnet faucet for 0.02 free test SOL, enough
  // for every step's fees and account deposits. It funds each wallet once.
  // It answers { signature }, or { error } with the reason it can't send.
  let reply: { signature?: string; error?: string };
  try {
    const response = await fetch("https://solana.com/api/devnet-airdrop", {
      method: "POST",
      body: new URLSearchParams({ address: wallet }),
    });
    reply = (await response.json().catch(() => ({
      error: `HTTP ${response.status} ${response.statusText}`,
    }))) as typeof reply;
  } catch (error) {
    reply = { error: `request failed (${(error as Error).message})` };
  }
  if (!reply.signature) {
    console.log(`No airdrop: ${reply.error ?? "the faucet sent no signature"}`);
    console.log(
      `Get devnet SOL for ${wallet} at https://faucet.solana.com, then run this again.`,
    );
    process.exit(0);
  }
  console.log("Airdrop:", reply.signature);
}
const { value: balance } = await client.rpc.getBalance(wallet).send();
console.log("Balance:", Number(balance) / 1e9, "SOL");

const usdc = await tokenBalance(wallet);
console.log("USDC:", usdc);
if (usdc === "0") {
  console.log(
    `Get free devnet USDC for ${wallet} at https://faucet.circle.com (pick Solana Devnet).`,
  );
}
// #endregion balance
