// #region fetch-list
// npx tsx fetch-list.ts
import { address } from "@solana/kit";
import { getList } from "@solana/mosaic-sdk";
import { env, rpc } from "./common";

// $LIST is the allowlist address create-the-mint.ts printed.
const list = await getList({ rpc, listConfig: address(env("LIST")) });
console.log("List:", list.listConfig);
// Mode 0 is an allowlist, 2 a blocklist.
console.log("Mode:", list.mode === 0 ? "Allow" : "Block");
console.log("Authority:", list.authority);
console.log("Wallets:", list.wallets.length ? list.wallets : "none");
// #endregion fetch-list
