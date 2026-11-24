// #region fetch-list
// npx tsx fetch-list.ts
import { PublicKey } from "@solana/web3.js-v3";
import {
  getListConfigDecoder,
  getWalletEntryDecoder,
  getWalletEntrySize,
  Mode,
  TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS,
} from "@solana/token-acl-gate-sdk";
import { connection, env } from "./common";

// $LIST is the allowlist address create-the-mint.ts printed.
const listConfig = new PublicKey(env("LIST"));
const listAccount = await connection.getAccountInfo(listConfig);
const list = getListConfigDecoder().decode(listAccount!.data);
console.log("List:", listConfig.toBase58());
console.log("Mode:", Mode[list.mode]);
console.log("Authority:", list.authority);

// Every approved wallet is its own entry account that points back at the
// list, so membership is read with a program-accounts query on that pointer.
const entries = await connection.getProgramAccounts(
  new PublicKey(TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS),
  {
    filters: [
      { dataSize: getWalletEntrySize() },
      { memcmp: { offset: 33, bytes: listConfig.toBase58() } },
    ],
  },
);
const wallets = entries.map(
  ({ account }) => getWalletEntryDecoder().decode(account.data).walletAddress,
);
console.log("Wallets:", wallets.length ? wallets : "none");
// #endregion fetch-list
