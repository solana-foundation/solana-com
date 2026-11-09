// #region subscribe
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js-v3";

const connection = new Connection("http://localhost:8899", "confirmed");

const wallet = await Keypair.generate();

// Resolves on the first notification, rejects after 30 seconds without one
let subscriptionId = 0;
const notified = new Promise<void>((resolve, reject) => {
  const timeout = setTimeout(
    () => reject(new Error("No account notification within 30 seconds")),
    30_000,
  );
  subscriptionId = connection.onAccountChange(
    wallet.publicKey,
    (accountInfo, context) => {
      clearTimeout(timeout);
      console.log("Context:", context);
      console.log("AccountInfo:", accountInfo);
      resolve();
    },
    { commitment: "confirmed" },
  );
});

// Give the subscription a moment to register before the airdrop
await new Promise((resolve) => setTimeout(resolve, 1000));

await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);

// Wait for the notification, then stop listening
try {
  await notified;
} finally {
  await connection.removeAccountChangeListener(subscriptionId);
}
// #endregion subscribe
