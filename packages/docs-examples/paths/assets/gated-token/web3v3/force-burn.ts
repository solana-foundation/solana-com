// #region force-burn
// npx tsx force-burn.ts <wallet> <amount>
import type { Instruction } from "@solana/kit";
import { PublicKey } from "@solana/web3.js-v3";
import {
  AccountState,
  findAssociatedTokenPda,
  getMintDecoder,
  getPermissionedBurnCheckedInstruction,
  getTokenDecoder,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import {
  addressOf,
  arg,
  connection,
  env,
  loadKeypair,
  send,
  toBaseUnits,
} from "./common";
import { thawThroughGate } from "./gate";

const payer = await loadKeypair("tokenization-demo");
const permanentDelegate = await loadKeypair("demo-authorities/delegate");
const burnAuthority = await loadKeypair("demo-authorities/burn");
const mint = addressOf(env("MINT"));
const list = addressOf(env("LIST"));
const owner = addressOf(arg(1, "the wallet to burn from"));
const mintAccount = await connection.getAccountInfo(new PublicKey(mint));
const { decimals } = getMintDecoder().decode(mintAccount!.data);
const [account] = await findAssociatedTokenPda({
  mint,
  owner,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});

// Token-2022 does not burn from a frozen account, so a frozen source is
// thawed through the gate first. That only works while the wallet is listed.
const instructions: Instruction[] = [];
const existing = await connection.getAccountInfo(new PublicKey(account));
if (
  existing &&
  getTokenDecoder().decode(existing.data).state === AccountState.Frozen
) {
  instructions.push(await thawThroughGate(payer, mint, account, owner, list));
}
// The permanent delegate signs in place of the holder, and the burn
// authority co-signs because the mint carries permissioned burn.
await send(
  [payer, permanentDelegate, burnAuthority],
  [
    ...instructions,
    getPermissionedBurnCheckedInstruction({
      account,
      mint,
      permissionedBurnAuthority: burnAuthority,
      authority: permanentDelegate,
      amount: toBaseUnits(arg(2, "the amount"), decimals),
      decimals,
    }),
  ],
);
// #endregion force-burn
