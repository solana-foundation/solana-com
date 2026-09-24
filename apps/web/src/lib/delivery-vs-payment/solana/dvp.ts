import {
  pipe,
  address,
  createNoopSigner,
  type Address,
  type Rpc,
  type SolanaRpcApi,
  type TransactionSigner,
  type Instruction,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  partiallySignTransactionMessageWithSigners,
  getTransactionEncoder,
  getBase64Decoder,
} from "@solana/kit";
import {
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
  getTransferCheckedInstruction,
  getCreateAssociatedTokenIdempotentInstruction,
} from "@solana-program/token";
import {
  getCreateDvpInstruction,
  getSettleDvpInstruction,
  getReclaimDvpInstruction,
  getRejectDvpInstruction,
  getCancelDvpInstruction,
  fetchMaybeSwapDvp,
} from "../dvp";
import { PROGRAM_ID } from "../config";
import { deriveDvpAddresses, type DvpAddresses } from "./pdas";

const PROG = address(PROGRAM_ID);
const TOKEN = TOKEN_PROGRAM_ADDRESS;
const MEMO_PROGRAM = address("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

/**
 * The treasury sponsors every transaction (fee payer + rent payer), so role
 * wallets need no SOL. Set once at init from /api/config.
 */
let sponsor: Address | null = null;
let sponsorNoop: TransactionSigner | null = null;
export function setSponsor(addr: string) {
  sponsor = address(addr);
  sponsorNoop = createNoopSigner(sponsor);
}
// A single cached instance: kit requires the same signer instance per address
// within a transaction (e.g. settle creates several treasury-paid ATAs).
function sponsorSigner(): TransactionSigner {
  if (!sponsorNoop) throw new Error("Fee sponsor not set");
  return sponsorNoop;
}

export interface TradeTerms {
  settlementAuthority: Address;
  userA: Address;
  userB: Address;
  mintA: Address;
  mintB: Address;
  amountA: bigint;
  amountB: bigint;
  decimalsA: number;
  decimalsB: number;
  nonce: bigint;
  expiryTimestamp: bigint;
  ref?: string | null;
}

async function ata(owner: Address, mint: Address): Promise<Address> {
  const [a] = await findAssociatedTokenPda({
    owner,
    mint,
    tokenProgram: TOKEN,
  });
  return a;
}

/** Rent for a created ATA is paid by the treasury sponsor. */
function createIdempotentAta(
  owner: Address,
  mint: Address,
  ataAddr: Address,
): Instruction {
  return getCreateAssociatedTokenIdempotentInstruction({
    payer: sponsorSigner(),
    owner,
    mint,
    ata: ataAddr,
    tokenProgram: TOKEN,
  });
}

/**
 * Build the tx with the treasury as fee payer, sign the role's part in the
 * browser, then relay to the server which adds the treasury signature and
 * submits. Returns the confirmed signature.
 */
async function sendIxs(
  rpc: Rpc<SolanaRpcApi>,
  ixs: Instruction[],
): Promise<string> {
  if (!sponsor) throw new Error("Fee sponsor not set");
  const { value: blockhash } = await rpc
    .getLatestBlockhash({ commitment: "confirmed" })
    .send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayer(sponsor!, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash, m),
    (m) => appendTransactionMessageInstructions(ixs, m),
  );
  const partiallySigned =
    await partiallySignTransactionMessageWithSigners(message);
  const wire = getBase64Decoder().decode(
    getTransactionEncoder().encode(partiallySigned),
  );
  const res = await fetch("/api/dvp-demo/relay", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tx: wire }),
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(body.error ?? "Relay failed");
  return body.signature as string;
}

/** CreateDvp: allocate the SwapDvp PDA + tombstone + both escrow ATAs. Rent paid by the treasury. */
export async function createDvp(
  rpc: Rpc<SolanaRpcApi>,
  terms: TradeTerms,
): Promise<{ signature: string; addresses: DvpAddresses }> {
  const addresses = await deriveDvpAddresses({ ...terms, tokenProgram: TOKEN });
  const ix = getCreateDvpInstruction(
    {
      payer: sponsorSigner(),
      swapDvp: addresses.swapDvp,
      nonceTombstone: addresses.nonceTombstone,
      settlementAuthority: terms.settlementAuthority,
      userA: terms.userA,
      userB: terms.userB,
      mintA: terms.mintA,
      mintB: terms.mintB,
      dvpAtaA: addresses.escrowA,
      dvpAtaB: addresses.escrowB,
      tokenProgramA: TOKEN,
      tokenProgramB: TOKEN,
      amountA: terms.amountA,
      amountB: terms.amountB,
      expiryTimestamp: terms.expiryTimestamp,
      nonce: terms.nonce,
      refString: terms.ref ?? null,
      userASettlementDestination: null,
      userBSettlementDestination: null,
      earliestSettlementTimestamp: null,
    },
    { programAddress: PROG },
  );
  const signature = await sendIxs(rpc, [ix]);
  return { signature, addresses };
}

/**
 * Fund a leg: a plain TransferChecked from the party's token account to the
 * escrow ATA. The party signs (authorizes moving its tokens); the treasury pays
 * the fee. Any wallet/exchange/custodian can do the equivalent transfer.
 */
export async function fundLeg(
  rpc: Rpc<SolanaRpcApi>,
  party: TransactionSigner,
  args: { mint: Address; decimals: number; escrow: Address; amount: bigint },
): Promise<string> {
  const source = await ata(party.address, args.mint);
  const ix = getTransferCheckedInstruction({
    source,
    mint: args.mint,
    destination: args.escrow,
    authority: party,
    amount: args.amount,
    decimals: args.decimals,
  });
  return sendIxs(rpc, [ix]);
}

/** SettleDvp: atomic cross-transfer of both legs, then close. Authority signs; treasury pays. */
export async function settle(
  rpc: Rpc<SolanaRpcApi>,
  authority: TransactionSigner,
  terms: TradeTerms,
  addresses: DvpAddresses,
): Promise<string> {
  const userADestB = await ata(terms.userA, terms.mintB); // cash → seller
  const userBDestA = await ata(terms.userB, terms.mintA); // asset → buyer
  const userAAtaA = await ata(terms.userA, terms.mintA); // asset surplus refund
  const userBAtaB = await ata(terms.userB, terms.mintB); // cash surplus refund

  const ixs: Instruction[] = [
    createIdempotentAta(terms.userA, terms.mintB, userADestB),
    createIdempotentAta(terms.userB, terms.mintA, userBDestA),
    createIdempotentAta(terms.userA, terms.mintA, userAAtaA),
    createIdempotentAta(terms.userB, terms.mintB, userBAtaB),
    getSettleDvpInstruction(
      {
        settlementAuthority: authority,
        swapDvp: addresses.swapDvp,
        mintA: terms.mintA,
        mintB: terms.mintB,
        dvpAtaA: addresses.escrowA,
        dvpAtaB: addresses.escrowB,
        userADestinationAtaB: userADestB,
        userBDestinationAtaA: userBDestA,
        userAAtaA,
        userBAtaB,
        tokenProgramA: TOKEN,
        tokenProgramB: TOKEN,
        memoProgram: MEMO_PROGRAM,
        legAExtrasCount: 0,
      },
      { programAddress: PROG },
    ),
  ];
  return sendIxs(rpc, ixs);
}

/** ReclaimDvp: a party pulls its own leg back while the trade stays open. */
export async function reclaim(
  rpc: Rpc<SolanaRpcApi>,
  party: TransactionSigner,
  args: { swapDvp: Address; mint: Address; escrow: Address },
): Promise<string> {
  const signerDestAta = await ata(party.address, args.mint);
  const ix = getReclaimDvpInstruction(
    {
      signer: party,
      swapDvp: args.swapDvp,
      mint: args.mint,
      dvpSourceAta: args.escrow,
      signerDestAta,
      tokenProgram: TOKEN,
      memoProgram: MEMO_PROGRAM,
    },
    { programAddress: PROG },
  );
  // The refund destination may have been closed since funding; recreate it so
  // the transfer can't fail, as the settlement path does.
  return sendIxs(rpc, [
    createIdempotentAta(party.address, args.mint, signerDestAta),
    ix,
  ]);
}

async function refundAndClose(
  rpc: Rpc<SolanaRpcApi>,
  signer: TransactionSigner,
  terms: TradeTerms,
  addresses: DvpAddresses,
  kind: "reject" | "cancel",
): Promise<string> {
  const userAAtaA = await ata(terms.userA, terms.mintA);
  const userBAtaB = await ata(terms.userB, terms.mintB);
  const common = {
    swapDvp: addresses.swapDvp,
    mintA: terms.mintA,
    mintB: terms.mintB,
    dvpAtaA: addresses.escrowA,
    dvpAtaB: addresses.escrowB,
    userAAtaA,
    userBAtaB,
    tokenProgramA: TOKEN,
    tokenProgramB: TOKEN,
    memoProgram: MEMO_PROGRAM,
    legAExtrasCount: 0,
  };
  const ix =
    kind === "reject"
      ? getRejectDvpInstruction({ signer, ...common }, { programAddress: PROG })
      : getCancelDvpInstruction(
          { settlementAuthority: signer, ...common },
          { programAddress: PROG },
        );
  // Refund destinations may have been closed since funding; recreate them so
  // the transfers can't fail, as the settlement path does.
  return sendIxs(rpc, [
    createIdempotentAta(terms.userA, terms.mintA, userAAtaA),
    createIdempotentAta(terms.userB, terms.mintB, userBAtaB),
    ix,
  ]);
}

export const reject = (
  rpc: Rpc<SolanaRpcApi>,
  party: TransactionSigner,
  terms: TradeTerms,
  addresses: DvpAddresses,
) => refundAndClose(rpc, party, terms, addresses, "reject");

export const cancel = (
  rpc: Rpc<SolanaRpcApi>,
  authority: TransactionSigner,
  terms: TradeTerms,
  addresses: DvpAddresses,
) => refundAndClose(rpc, authority, terms, addresses, "cancel");

export interface TradeState {
  open: boolean;
  escrowABalance: bigint;
  escrowBBalance: bigint;
}

async function tokenBalance(
  rpc: Rpc<SolanaRpcApi>,
  account: Address,
): Promise<bigint> {
  try {
    const { value } = await rpc.getTokenAccountBalance(account).send();
    return BigInt(value.amount);
  } catch {
    return 0n;
  }
}

export async function readTradeState(
  rpc: Rpc<SolanaRpcApi>,
  addresses: DvpAddresses,
): Promise<TradeState> {
  const [maybe, escrowABalance, escrowBBalance] = await Promise.all([
    fetchMaybeSwapDvp(rpc, addresses.swapDvp),
    tokenBalance(rpc, addresses.escrowA),
    tokenBalance(rpc, addresses.escrowB),
  ]);
  return { open: maybe.exists, escrowABalance, escrowBBalance };
}
