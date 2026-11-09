// #region subscribe
import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
  lamports,
} from "@solana/kit";

const LAMPORTS_PER_SOL = lamports(1_000_000_000n);

const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

const wallet = await generateKeyPairSigner();

// Unsubscribe after the first notification, or after 30 seconds without one
const abortController = new AbortController();
const timeout = setTimeout(() => abortController.abort(), 30_000);

const notifications = await rpcSubscriptions
  .accountNotifications(wallet.address, { commitment: "confirmed" })
  .subscribe({ abortSignal: abortController.signal });

await rpc.requestAirdrop(wallet.address, LAMPORTS_PER_SOL).send();

for await (const notification of notifications) {
  console.log(notification);
  break;
}

clearTimeout(timeout);
abortController.abort();
// #endregion subscribe
