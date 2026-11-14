// #region read-account
// npx tsx read-account.ts <token account> [commitment]
import { type Commitment, PublicKey } from "@solana/web3.js-v3";
import { AccountState, getTokenDecoder } from "@solana-program/token-2022";
import { arg, connection } from "./common";

const tokenAccount = new PublicKey(arg(1, "the token account"));
// Read at a stated commitment level. Use "finalized" for anything that feeds
// a book of record; "confirmed" is enough for a display.
const commitment = (process.argv[3] ?? "confirmed") as Commitment;

const info = await connection.getAccountInfo(tokenAccount, commitment);
const data = getTokenDecoder().decode(info!.data);
console.log("Mint:", data.mint);
console.log("Owner:", data.owner);
console.log("Balance (base units):", data.amount.toString());
console.log("State:", AccountState[data.state]);
// #endregion read-account
