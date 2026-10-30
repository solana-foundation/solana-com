// #region transfer
// npx tsx transfer.ts <recipient> <amount>
import { address } from "@solana/kit";
import {
  fetchMint,
  findAssociatedTokenPda,
  getTransferCheckedInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { arg, env, loadSigner, rpc, send, toBaseUnits } from "./common";
import { openThroughGate } from "./gate";

// The holder signs and pays for its own transfer.
const holder = await loadSigner("demo-holder");
const mint = address(env("MINT"));
const list = address(env("LIST"));
const { data } = await fetchMint(rpc, mint);

const [source] = await findAssociatedTokenPda({
  mint,
  owner: holder.address,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
// The thaw is where an unlisted recipient fails: the gate rejects the owner
// and the whole transaction is dropped before any token moves.
const { tokenAccount: destination, instructions } = await openThroughGate(
  holder,
  mint,
  address(arg(1, "the recipient wallet")),
  list,
);
await send(holder, [
  ...instructions,
  getTransferCheckedInstruction({
    source,
    mint,
    destination,
    authority: holder,
    amount: toBaseUnits(arg(2, "the amount"), data.decimals),
    decimals: data.decimals,
  }),
]);
// #endregion transfer
