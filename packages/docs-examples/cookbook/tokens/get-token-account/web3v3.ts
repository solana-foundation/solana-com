// #region fetch
import { Connection, PublicKey } from "@solana/web3.js-v3";
import { getTokenDecoder } from "@solana-program/token-2022";

const connection = new Connection("http://localhost:8899", "confirmed");

const tokenAccountPubkey = new PublicKey(
  "GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ",
);

const accountInfo = await connection.getAccountInfo(
  tokenAccountPubkey,
  "confirmed",
);
const tokenAccount = getTokenDecoder().decode(accountInfo!.data);
console.log(tokenAccount);
// #endregion fetch
