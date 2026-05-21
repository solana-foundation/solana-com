// #region balance
import { address, createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("https://api.mainnet.solana.com");

const tokenAccountAddress = address(
  "GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ",
);

const balance = await rpc.getTokenAccountBalance(tokenAccountAddress).send();
console.log(balance);
// #endregion balance
