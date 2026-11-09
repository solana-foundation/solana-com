// #region airdrop
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js-v3";

const connection = new Connection("http://localhost:8899", "confirmed");

const wallet = await Keypair.generate();

const signature = await connection.requestAirdrop(
  wallet.publicKey,
  LAMPORTS_PER_SOL,
);

const { blockhash, lastValidBlockHeight } =
  await connection.getLatestBlockhash();

await connection.confirmTransaction({
  blockhash,
  lastValidBlockHeight,
  signature,
});

const balance = await connection.getBalance(wallet.publicKey);
console.log(`Balance: ${Number(balance) / LAMPORTS_PER_SOL} SOL`);
// #endregion airdrop
