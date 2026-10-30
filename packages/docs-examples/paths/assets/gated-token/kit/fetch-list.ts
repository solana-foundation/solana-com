// #region fetch-list
// npx tsx fetch-list.ts
import {
  address,
  type Base58EncodedBytes,
  getBase64Encoder,
} from "@solana/kit";
import {
  fetchListConfig,
  getWalletEntryDecoder,
  getWalletEntrySize,
  Mode,
  TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS,
} from "@solana/token-acl-gate-sdk";
import { env, rpc } from "./common";

// $LIST is the allowlist address create-the-mint.ts printed.
const listConfig = address(env("LIST"));
const { data: list } = await fetchListConfig(rpc, listConfig);
console.log("List:", listConfig);
console.log("Mode:", Mode[list.mode]);
console.log("Authority:", list.authority);

// Every approved wallet is its own entry account that points back at the
// list, so membership is read with a program-accounts query on that pointer.
const entries = await rpc
  .getProgramAccounts(TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS, {
    encoding: "base64",
    filters: [
      { dataSize: BigInt(getWalletEntrySize()) },
      {
        memcmp: {
          offset: 33n,
          bytes: listConfig as string as Base58EncodedBytes,
          encoding: "base58",
        },
      },
    ],
  })
  .send();
const wallets = entries.map(
  ({ account }) =>
    getWalletEntryDecoder().decode(getBase64Encoder().encode(account.data[0]))
      .walletAddress,
);
console.log("Wallets:", wallets.length ? wallets : "none");
// #endregion fetch-list
