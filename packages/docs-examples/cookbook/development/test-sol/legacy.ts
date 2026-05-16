// #region airdrop
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

const wallet = Keypair.generate();

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
console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
// #endregion airdrop
