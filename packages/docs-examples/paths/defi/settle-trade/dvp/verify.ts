/**
 * Checked, verify-before-fund helpers for the DvP swap client.
 *
 * The generated `fetchSwapDvp` / `decodeSwapDvp` decode any bytes at an
 * address with no owner check. Escrows are funded by raw transfers to an ATA
 * derived from the `swap_dvp` pubkey, so an attacker-owned account that
 * decodes as a `SwapDvp` lets a funder deposit into an ATA the attacker drains.
 *
 * These helpers require, before treating an account as a canonical `SwapDvp`:
 * owner is the DvP program, size is exactly `SWAP_DVP_ACCOUNT_SIZE`, and the
 * address is the canonical PDA for the decoded terms. `findSwapDvpPda` and
 * `findSwapDvpEscrowAta` derive those addresses from agreed terms.
 */
import {
  assertAccountExists,
  decodeAccount,
  fetchEncodedAccount,
  getAddressEncoder,
  getProgramDerivedAddress,
  type Account,
  type Address,
  type EncodedAccount,
  type FetchAccountConfig,
  type MaybeEncodedAccount,
  type ReadonlyUint8Array,
} from "@solana/kit";
import { getSwapDvpDecoder, type SwapDvp } from "./generated/accounts/swapDvp";
import { DVP_SWAP_PROGRAM_PROGRAM_ADDRESS } from "./generated/programs/dvpSwapProgram";
import { getSafeU64Encoder } from "./safeNumberCodecs";

/** Fixed on-chain size of a `SwapDvp` account (`SwapDvp::LEN`). */
export const SWAP_DVP_ACCOUNT_SIZE = 458;

/** Seed prefix for the `SwapDvp` PDA (`SWAP_DVP_SEED`). */
export const SWAP_DVP_SEED = "dvp";

/** Canonical SPL Associated Token Account program. */
export const ASSOCIATED_TOKEN_PROGRAM_ADDRESS =
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL" as Address;

export class SwapDvpVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SwapDvpVerificationError";
  }
}

const textEncoder = new TextEncoder();

/**
 * Decodes a fetched account as a `SwapDvp`, rejecting it unless it is owned
 * by the DvP program and exactly the on-chain size. Use instead of the
 * generated `decodeSwapDvp`. Throws if the account does not exist.
 *
 * This does NOT verify the account sits at its canonical PDA (PDA derivation
 * is async in kit). When checking a counterparty-supplied address before
 * funding, use `verifySwapDvp`, which adds the PDA check, or derive the
 * address with `findSwapDvpPda` and compare it yourself. The Rust
 * `verify::decode_swap_dvp_account` bundles all three checks because it takes
 * the expected address and derives the PDA synchronously.
 */
export function decodeSwapDvpChecked<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress> | MaybeEncodedAccount<TAddress>,
): Account<SwapDvp, TAddress> {
  assertAccountExists(encodedAccount as MaybeEncodedAccount<TAddress>);
  const account = encodedAccount as EncodedAccount<TAddress>;

  if (account.programAddress !== DVP_SWAP_PROGRAM_PROGRAM_ADDRESS) {
    throw new SwapDvpVerificationError(
      `Account ${account.address} is not owned by the DvP program ` +
        `(${DVP_SWAP_PROGRAM_PROGRAM_ADDRESS}); it is owned by ` +
        `${account.programAddress}. Refusing to treat it as a SwapDvp.`,
    );
  }

  if (account.data.length !== SWAP_DVP_ACCOUNT_SIZE) {
    throw new SwapDvpVerificationError(
      `Account ${account.address} has ${account.data.length} bytes of data; ` +
        `a canonical SwapDvp is exactly ${SWAP_DVP_ACCOUNT_SIZE} bytes.`,
    );
  }

  return decodeAccount(account, getSwapDvpDecoder());
}

/**
 * Fetches and checks a `SwapDvp` in one call. Throws if the account is
 * missing, wrong-owner, or wrong-size.
 */
export async function fetchSwapDvpChecked<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig,
): Promise<Account<SwapDvp, TAddress>> {
  const encoded = await fetchEncodedAccount(rpc, address, config);
  return decodeSwapDvpChecked(encoded);
}

// The nonce is a PDA seed; a JavaScript number above 2^53 would round
// before encoding and derive the wrong address, so require a bigint.
const u64Bytes = (value: bigint): ReadonlyUint8Array =>
  getSafeU64Encoder().encode(value);

/**
 * Derives the canonical `SwapDvp` PDA from agreed terms (on-chain seeds
 * `[b"dvp", settlement_authority, user_a, user_b, mint_a, mint_b, nonce_le]`).
 * Compare this against any address a counterparty supplies.
 */
export function findSwapDvpPda(args: {
  settlementAuthority: Address;
  userA: Address;
  userB: Address;
  mintA: Address;
  mintB: Address;
  nonce: bigint;
  programAddress?: Address;
}): Promise<readonly [Address, number]> {
  const addressEncoder = getAddressEncoder();
  return getProgramDerivedAddress({
    programAddress: args.programAddress ?? DVP_SWAP_PROGRAM_PROGRAM_ADDRESS,
    seeds: [
      textEncoder.encode(SWAP_DVP_SEED),
      addressEncoder.encode(args.settlementAuthority),
      addressEncoder.encode(args.userA),
      addressEncoder.encode(args.userB),
      addressEncoder.encode(args.mintA),
      addressEncoder.encode(args.mintB),
      u64Bytes(args.nonce),
    ],
  });
}

/**
 * Derives a leg's escrow ATA (the `SwapDvp` PDA's ATA for a mint/token
 * program). Funders send raw transfers here, so derive it from a verified
 * `swapDvp` PDA, not from an unverified supplied address.
 */
export function findSwapDvpEscrowAta(args: {
  swapDvp: Address;
  mint: Address;
  tokenProgram: Address;
}): Promise<readonly [Address, number]> {
  const addressEncoder = getAddressEncoder();
  return getProgramDerivedAddress({
    programAddress: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
    seeds: [
      addressEncoder.encode(args.swapDvp),
      addressEncoder.encode(args.tokenProgram),
      addressEncoder.encode(args.mint),
    ],
  });
}

/**
 * Full verify-before-fund check: confirms a fetched `SwapDvp` is
 * program-owned, exact-size, and at the canonical PDA for its decoded terms.
 * Throws `SwapDvpVerificationError` otherwise.
 */
export async function verifySwapDvp<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig,
): Promise<Account<SwapDvp, TAddress>> {
  const account = await fetchSwapDvpChecked(rpc, address, config);
  const { data } = account;
  const [expected] = await findSwapDvpPda({
    settlementAuthority: data.settlementAuthority,
    userA: data.userA,
    userB: data.userB,
    mintA: data.mintA,
    mintB: data.mintB,
    nonce: data.nonce,
  });
  if (expected !== (address as Address)) {
    throw new SwapDvpVerificationError(
      `Account ${address} is program-owned but not at its canonical PDA ` +
        `for the stored terms (expected ${expected}). Refusing to trust it.`,
    );
  }
  return account;
}
