// #region read-account
// npx tsx read-account.ts <token account> [commitment]
import { address, type Commitment } from "@solana/kit";
import { AccountState, fetchToken } from "@solana-program/token-2022";
import { arg, rpc } from "./common";

const tokenAccount = address(arg(1, "the token account"));
// Read at a stated commitment level. Use "finalized" for anything that feeds
// a book of record; "confirmed" is enough for a display.
const commitment = (process.argv[3] ?? "confirmed") as Commitment;

const { data } = await fetchToken(rpc, tokenAccount, { commitment });
console.log("Mint:", data.mint);
console.log("Owner:", data.owner);
console.log("Balance (base units):", data.amount.toString());
console.log("State:", AccountState[data.state]);
// #endregion read-account
