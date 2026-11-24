// #region force-transfer
// npx tsx force-transfer.ts <from wallet> <to wallet> <amount>
import { address } from "@solana/kit";
import {
  fetchMint,
  findAssociatedTokenPda,
  getTransferCheckedInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { arg, env, loadSigner, rpc, send, toBaseUnits } from "./common";
import { openThroughGate } from "./gate";

const payer = await loadSigner("tokenization-demo");
const permanentDelegate = await loadSigner("demo-authorities/delegate");
const mint = address(env("MINT"));
const list = address(env("LIST"));
const { data } = await fetchMint(rpc, mint);

const [source] = await findAssociatedTokenPda({
  mint,
  owner: address(arg(1, "the source wallet")),
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
// The destination still has to be able to hold the token, so it is opened
// through the gate like any other recipient.
const { tokenAccount: destination, instructions } = await openThroughGate(
  payer,
  mint,
  address(arg(2, "the destination wallet")),
  list,
);
// An ordinary TransferChecked, signed by the permanent delegate in place of
// the holder.
await send(payer, [
  ...instructions,
  getTransferCheckedInstruction({
    source,
    mint,
    destination,
    authority: permanentDelegate,
    amount: toBaseUnits(arg(3, "the amount"), data.decimals),
    decimals: data.decimals,
  }),
]);
// #endregion force-transfer
