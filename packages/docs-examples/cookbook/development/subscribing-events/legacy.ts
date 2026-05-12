// #region subscribe
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

const wallet = Keypair.generate();

const subscriptionId = connection.onAccountChange(
  wallet.publicKey,
  (accountInfo, context) => {
    console.log("Context:", context);
    console.log("AccountInfo:", accountInfo);
  },
  { commitment: "confirmed" },
);

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

await connection.removeAccountChangeListener(subscriptionId);
// #endregion subscribe
