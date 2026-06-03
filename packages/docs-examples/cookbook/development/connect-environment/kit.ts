// #region rpc-url
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);
// #endregion rpc-url

// Reference the symbols so a fresh import doesn't tree-shake them away.
void rpc;
void rpcSubscriptions;
