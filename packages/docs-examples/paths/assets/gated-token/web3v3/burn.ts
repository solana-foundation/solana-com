// #region burn
// npx tsx burn.ts <amount>
import { PublicKey } from "@solana/web3.js-v3";
import {
  findAssociatedTokenPda,
  getMintDecoder,
  getPermissionedBurnCheckedInstruction,
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

const holder = await loadKeypair("demo-holder");
const burnAuthority = await loadKeypair("demo-authorities/burn");
const mint = addressOf(env("MINT"));
const mintAccount = await connection.getAccountInfo(new PublicKey(mint));
const { decimals } = getMintDecoder().decode(mintAccount!.data);
const [account] = await findAssociatedTokenPda({
  mint,
  owner: holder.publicKey.toBase58(),
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});

// Token-2022 rejects a plain burn on this mint. The permissioned burn
// instruction carries both signers: the holder and the burn authority.
await send(
  [holder, burnAuthority],
  [
    getPermissionedBurnCheckedInstruction({
      account,
      mint,
      permissionedBurnAuthority: burnAuthority,
      authority: holder,
      amount: toBaseUnits(arg(1, "the amount"), decimals),
      decimals,
    }),
  ],
);
// #endregion burn
