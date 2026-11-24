// #region force-transfer
// npx tsx force-transfer.ts <from wallet> <to wallet> <amount>
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

const payer = await loadKeypair("tokenization-demo");
const permanentDelegate = await loadKeypair("demo-authorities/delegate");
const mint = addressOf(env("MINT"));
const list = addressOf(env("LIST"));
const mintAccount = await connection.getAccountInfo(new PublicKey(mint));
const { decimals } = getMintDecoder().decode(mintAccount!.data);

const [source] = await findAssociatedTokenPda({
  mint,
  owner: addressOf(arg(1, "the source wallet")),
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
// The destination still has to be able to hold the token, so it is opened
// through the gate like any other recipient.
const { tokenAccount: destination, instructions } = await openThroughGate(
  payer,
  mint,
  addressOf(arg(2, "the destination wallet")),
  list,
);
// An ordinary TransferChecked, signed by the permanent delegate in place of
// the holder.
await send(
  [payer, permanentDelegate],
  [
    ...instructions,
    getTransferCheckedInstruction({
      source,
      mint,
      destination,
      authority: permanentDelegate,
      amount: toBaseUnits(arg(3, "the amount"), decimals),
      decimals,
    }),
  ],
);
// #endregion force-transfer
