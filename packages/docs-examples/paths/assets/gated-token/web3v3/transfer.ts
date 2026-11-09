// #region transfer
// npx tsx transfer.ts <recipient> <amount>
import { PublicKey } from "@solana/web3.js-v3";
import {
  findAssociatedTokenPda,
  getMintDecoder,
  getTransferCheckedInstruction,
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
import { openThroughGate } from "./gate";

// The holder signs and pays for its own transfer.
const holder = await loadKeypair("demo-holder");
const mint = addressOf(env("MINT"));
const list = addressOf(env("LIST"));
const mintAccount = await connection.getAccountInfo(new PublicKey(mint));
const { decimals } = getMintDecoder().decode(mintAccount!.data);

const [source] = await findAssociatedTokenPda({
  mint,
  owner: holder.publicKey.toBase58(),
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
// The thaw is where an unlisted recipient fails: the gate rejects the owner
// and the whole transaction is dropped before any token moves.
const { tokenAccount: destination, instructions } = await openThroughGate(
  holder,
  mint,
  addressOf(arg(1, "the recipient wallet")),
  list,
);
await send(
  [holder],
  [
    ...instructions,
    getTransferCheckedInstruction({
      source,
      mint,
      destination,
      authority: holder,
      amount: toBaseUnits(arg(2, "the amount"), decimals),
      decimals,
    }),
  ],
);
// #endregion transfer
