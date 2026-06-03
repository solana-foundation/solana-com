// #region fetch
import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection("http://localhost:8899", "confirmed");

const tokenAccountPubkey = new PublicKey(
  "GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ",
);

const tokenAccount = await getAccount(
  connection,
  tokenAccountPubkey,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);
console.log(tokenAccount);
// #endregion fetch
