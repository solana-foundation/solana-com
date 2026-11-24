// #region force-burn
// npx tsx force-burn.ts <wallet> <amount>
import { address, type Instruction } from "@solana/kit";
import {
  AccountState,
  fetchMaybeToken,
  fetchMint,
  findAssociatedTokenPda,
  getPermissionedBurnCheckedInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { arg, env, loadSigner, rpc, send, toBaseUnits } from "./common";
import { thawThroughGate } from "./gate";

const payer = await loadSigner("tokenization-demo");
const permanentDelegate = await loadSigner("demo-authorities/delegate");
const burnAuthority = await loadSigner("demo-authorities/burn");
const mint = address(env("MINT"));
const list = address(env("LIST"));
const owner = address(arg(1, "the wallet to burn from"));
const { data } = await fetchMint(rpc, mint);
const [account] = await findAssociatedTokenPda({
  mint,
  owner,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});

// Token-2022 does not burn from a frozen account, so a frozen source is
// thawed through the gate first. That only works while the wallet is listed.
const instructions: Instruction[] = [];
const existing = await fetchMaybeToken(rpc, account);
if (existing.exists && existing.data.state === AccountState.Frozen) {
  instructions.push(await thawThroughGate(payer, mint, account, owner, list));
}
// The permanent delegate signs in place of the holder, and the burn
// authority co-signs because the mint carries permissioned burn.
await send(payer, [
  ...instructions,
  getPermissionedBurnCheckedInstruction({
    account,
    mint,
    permissionedBurnAuthority: burnAuthority,
    authority: permanentDelegate,
    amount: toBaseUnits(arg(2, "the amount"), data.decimals),
    decimals: data.decimals,
  }),
]);
// #endregion force-burn
