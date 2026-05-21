// #region balance
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  "https://api.mainnet.solana.com",
  "confirmed",
);

const tokenAccount = new PublicKey(
  "GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ",
);

const tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
console.log(`amount: ${tokenAmount.value.amount}`);
console.log(`decimals: ${tokenAmount.value.decimals}`);
// #endregion balance
