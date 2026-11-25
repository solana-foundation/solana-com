import {
  getProgramDerivedAddress,
  getAddressEncoder,
  address,
  type Address,
} from "@solana/kit";
import { PROGRAM_ID } from "../config";
import { findSwapDvpPda, findSwapDvpEscrowAta } from "../dvp";

export { findSwapDvpPda, findSwapDvpEscrowAta };

const PROG = address(PROGRAM_ID);
const NONCE_SEED = new TextEncoder().encode("nonce");

/** The per-DvP nonce tombstone PDA: seeds ["nonce", swap_dvp]. Not exposed by the client. */
export async function findNonceTombstonePda(
  swapDvp: Address,
): Promise<Address> {
  const [pda] = await getProgramDerivedAddress({
    programAddress: PROG,
    seeds: [NONCE_SEED, getAddressEncoder().encode(swapDvp)],
  });
  return pda;
}

/** All addresses derived from a trade's terms. */
export interface DvpAddresses {
  swapDvp: Address;
  nonceTombstone: Address;
  escrowA: Address;
  escrowB: Address;
}

export async function deriveDvpAddresses(args: {
  settlementAuthority: Address;
  userA: Address;
  userB: Address;
  mintA: Address;
  mintB: Address;
  nonce: bigint;
  tokenProgram: Address;
}): Promise<DvpAddresses> {
  const [swapDvp] = await findSwapDvpPda({
    settlementAuthority: args.settlementAuthority,
    userA: args.userA,
    userB: args.userB,
    mintA: args.mintA,
    mintB: args.mintB,
    nonce: args.nonce,
    programAddress: PROG,
  });
  const nonceTombstone = await findNonceTombstonePda(swapDvp);
  const [escrowA] = await findSwapDvpEscrowAta({
    swapDvp,
    mint: args.mintA,
    tokenProgram: args.tokenProgram,
  });
  const [escrowB] = await findSwapDvpEscrowAta({
    swapDvp,
    mint: args.mintB,
    tokenProgram: args.tokenProgram,
  });
  return { swapDvp, nonceTombstone, escrowA, escrowB };
}
