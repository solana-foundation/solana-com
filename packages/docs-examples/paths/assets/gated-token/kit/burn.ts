// #region burn
// npx tsx burn.ts <amount>
import { address } from "@solana/kit";
import {
  fetchMint,
  findAssociatedTokenPda,
  getPermissionedBurnCheckedInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { arg, env, loadSigner, rpc, send, toBaseUnits } from "./common";

const holder = await loadSigner("demo-holder");
const burnAuthority = await loadSigner("demo-authorities/burn");
const mint = address(env("MINT"));
const { data } = await fetchMint(rpc, mint);
const [account] = await findAssociatedTokenPda({
  mint,
  owner: holder.address,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});

// Token-2022 rejects a plain burn on this mint. The permissioned burn
// instruction carries both signers: the holder and the burn authority.
await send(holder, [
  getPermissionedBurnCheckedInstruction({
    account,
    mint,
    permissionedBurnAuthority: burnAuthority,
    authority: holder,
    amount: toBaseUnits(arg(1, "the amount"), data.decimals),
    decimals: data.decimals,
  }),
]);
// #endregion burn
