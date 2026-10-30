/**
 * Turns the recorded fixture (packages/docs-examples/paths/defi/settle-trade/
 * settle-walkthrough.json, written by walkthrough.test.ts from a real Surfpool
 * run, copied into content/snippets by examples:build) into what the
 * walkthrough shows. Nothing here is typed in by hand:
 * flags come from the message header, sizes from the wire bytes, CPIs from
 * the inner instructions, and balances from the token balances and lamports.
 */

export interface RecordedFixture {
  signature: string;
  cashAmount: string;
  assetAmount: string;
  labels: Record<string, string>;
  wireBase64: string;
  getTransaction: {
    slot: number;
    blockTime: number | null;
    version: number | "legacy";
    transaction: {
      signatures: string[];
      message: {
        header: {
          numRequiredSignatures: number;
          numReadonlySignedAccounts: number;
          numReadonlyUnsignedAccounts: number;
        };
        accountKeys: string[];
        recentBlockhash: string;
        instructions: RawInstruction[];
      };
    };
    meta: {
      err: unknown;
      status: unknown;
      fee: number;
      computeUnitsConsumed?: number;
      logMessages: string[];
      preBalances: number[];
      postBalances: number[];
      preTokenBalances: RawTokenBalance[];
      postTokenBalances: RawTokenBalance[];
      innerInstructions: { index: number; instructions: RawInstruction[] }[];
    };
  };
}

interface RawInstruction {
  programIdIndex: number;
  accounts: number[];
  data: string;
  stackHeight?: number | null;
}

interface RawTokenBalance {
  accountIndex: number;
  mint: string;
  owner?: string;
  uiTokenAmount: { amount: string; decimals: number; uiAmountString?: string };
}

export interface AccountRef {
  index: number;
  address: string;
  label: string;
  signer: boolean;
  writable: boolean;
}

export interface InstructionView {
  index: number;
  program: AccountRef;
  name: string;
  accounts: AccountRef[];
  data: number[];
}

export interface CpiView {
  program: AccountRef;
  name: string;
  /** TransferChecked only: whole-token amount, e.g. "100". */
  amount?: string;
  symbol?: string;
  from: AccountRef;
  to: AccountRef;
  /** The account that authorized it (the trade record PDA here). */
  authority: AccountRef;
}

export interface BalanceChange {
  account: AccountRef;
  symbol: string;
  /** null: the account did not exist before. */
  before: string | null;
  /** null: the transaction closed the account. */
  after: string | null;
}

export interface WalkthroughModel {
  signature: string;
  cash: string;
  asset: string;
  slot: number;
  version: string;
  /** The signed transaction as sent, in bytes. */
  sizeBytes: number;
  /** The message, the bytes the fee payer signs. */
  messageBytes: number;
  maxBytes: number;
  numRequiredSignatures: number;
  feePayer: AccountRef;
  recentBlockhash: string;
  accounts: AccountRef[];
  instructions: InstructionView[];
  /** The calls the DvP instruction made into the token programs. */
  cpis: CpiView[];
  fee: number;
  computeUnits: number | null;
  succeeded: boolean;
  status: unknown;
  logs: string[];
  /** The DvP instruction's own log lines (its invoke through its success). */
  programLogs: string[];
  balances: BalanceChange[];
}

/** Solana's packet limit for one transaction. */
const MAX_TRANSACTION_BYTES = 1232;

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58Decode(text: string): number[] {
  let n = 0n;
  for (const ch of text) {
    const v = B58.indexOf(ch);
    if (v < 0) throw new Error(`not base58: ${ch}`);
    n = n * 58n + BigInt(v);
  }
  const bytes: number[] = [];
  while (n > 0n) {
    bytes.unshift(Number(n & 0xffn));
    n >>= 8n;
  }
  for (const ch of text) {
    if (ch !== "1") break;
    bytes.unshift(0);
  }
  return bytes;
}

function base64Length(text: string): number {
  const clean = text.replace(/=+$/, "");
  return Math.floor((clean.length * 3) / 4);
}

/** Compact-u16 length prefix of the signature count. */
function compactU16Length(n: number) {
  return n < 0x80 ? 1 : n < 0x4000 ? 2 : 3;
}

const TOKEN = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const TOKEN_2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
const ATA = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
export const DVP_PROGRAM = "dvp34bdbcEm4f4FCUjGV4mDAkDshaQR4LkK8fdcsyZq";

/**
 * Instruction names by first data byte. DvP: the discriminators of the
 * generated client (dvp/generated/instructions, checked by the tests).
 * Token programs: the SPL Token instruction enum. ATA: Create = 0,
 * CreateIdempotent = 1.
 */
export const INSTRUCTION_NAMES: Record<string, Record<number, string>> = {
  [DVP_PROGRAM]: {
    0: "CreateDvp",
    1: "ReclaimDvp",
    2: "SettleDvp",
    3: "CancelDvp",
    4: "RejectDvp",
    5: "RecoverDvp",
  },
  [TOKEN]: { 9: "CloseAccount", 12: "TransferChecked" },
  [TOKEN_2022]: { 9: "CloseAccount", 12: "TransferChecked" },
  [ATA]: { 0: "Create", 1: "CreateIdempotent" },
};

/**
 * The recorded run uses the tutorial's demo asset, LSF (Lisbon Solar Fund).
 * The walkthrough never introduces it, so it calls it "fund shares".
 */
const ASSET_NAME = "fund shares";

function displayLabel(label: string) {
  return label
    .replace(/^LSF (escrow|mint)$/, "Fund share $1")
    .replace(/\bLSF account\b/, "fund share account");
}

function symbolFor(label: string) {
  if (label.startsWith("USDC")) return "USDC";
  if (label.startsWith("LSF") || label.startsWith("Fund share"))
    return ASSET_NAME;
  return label;
}

/** "100.000000" -> "100", "4.999296" stays. */
function trimAmount(ui: string) {
  return ui.includes(".") ? ui.replace(/\.?0+$/, "") : ui;
}

function u64le(bytes: number[], offset: number) {
  let v = 0n;
  for (let i = 7; i >= 0; i--) v = (v << 8n) | BigInt(bytes[offset + i]);
  return v;
}

function units(amount: bigint, decimals: number) {
  const s = amount.toString().padStart(decimals + 1, "0");
  return trimAmount(`${s.slice(0, -decimals)}.${s.slice(-decimals)}`);
}

export function buildModel(f: RecordedFixture): WalkthroughModel {
  const tx = f.getTransaction;
  const { message } = tx.transaction;
  const { header, accountKeys } = message;
  const n = accountKeys.length;
  const signedCount = header.numRequiredSignatures;

  const accounts: AccountRef[] = accountKeys.map((address, index) => {
    const signer = index < signedCount;
    const writable = signer
      ? index < signedCount - header.numReadonlySignedAccounts
      : index < n - header.numReadonlyUnsignedAccounts;
    const recorded = f.labels[address];
    if (!recorded) throw new Error(`fixture has no label for ${address}`);
    const label = displayLabel(recorded);
    return { index, address, label, signer, writable };
  });

  const nameOf = (program: string, data: number[]) =>
    INSTRUCTION_NAMES[program]?.[data[0]] ?? "Instruction";

  const instructions: InstructionView[] = message.instructions.map(
    (ix, index) => {
      const program = accounts[ix.programIdIndex];
      const data = base58Decode(ix.data);
      return {
        index,
        program,
        name: nameOf(program.address, data),
        accounts: ix.accounts.map((i) => accounts[i]),
        data,
      };
    },
  );

  const dvpIndex = instructions.findIndex(
    (ix) => ix.program.address === DVP_PROGRAM,
  );
  const inner =
    tx.meta.innerInstructions.find((g) => g.index === dvpIndex)?.instructions ??
    [];
  const decimalsOf = (mint: string) =>
    [...tx.meta.preTokenBalances, ...tx.meta.postTokenBalances].find(
      (b) => b.mint === mint,
    )?.uiTokenAmount.decimals ?? 0;
  const cpis: CpiView[] = inner.map((ix) => {
    const program = accounts[ix.programIdIndex];
    const data = base58Decode(ix.data);
    const name = nameOf(program.address, data);
    const a = ix.accounts.map((i) => accounts[i]);
    if (name === "TransferChecked") {
      // TransferChecked accounts: source, mint, destination, authority.
      const [from, mint, to, authority] = a;
      return {
        program,
        name,
        amount: units(u64le(data, 1), decimalsOf(mint.address)),
        symbol: symbolFor(mint.label),
        from,
        to,
        authority,
      };
    }
    // CloseAccount accounts: account, destination, owner.
    const [from, to, authority] = a;
    return { program, name, from, to, authority };
  });

  // Token balances that changed. A closed account has 0 lamports after the
  // transaction; Surfpool still lists its last token balance in
  // postTokenBalances, so lamports decide "closed" here.
  const pre = new Map(tx.meta.preTokenBalances.map((b) => [b.accountIndex, b]));
  const post = new Map(
    tx.meta.postTokenBalances.map((b) => [b.accountIndex, b]),
  );
  const balances: BalanceChange[] = [];
  for (const index of new Set([...pre.keys(), ...post.keys()])) {
    const closed = tx.meta.postBalances[index] === 0;
    const b = pre.get(index) ?? post.get(index)!;
    const before = pre.get(index)?.uiTokenAmount.uiAmountString;
    const after = closed
      ? null
      : (post.get(index)?.uiTokenAmount.uiAmountString ?? null);
    const change = {
      account: accounts[index],
      symbol: symbolFor(f.labels[b.mint] ?? b.mint),
      before: before === undefined ? null : trimAmount(before),
      after: after === null ? null : trimAmount(after),
    };
    if (change.before !== change.after) balances.push(change);
  }
  // Cash first, then the asset; within each, money leaving before arriving.
  balances.sort(
    (x, y) =>
      Number(x.symbol !== "USDC") - Number(y.symbol !== "USDC") ||
      Number(y.before ?? -1) - Number(x.before ?? -1),
  );

  const logs = tx.meta.logMessages;
  const start = logs.findIndex(
    (l) => l === `Program ${DVP_PROGRAM} invoke [1]`,
  );
  const end = logs.findIndex(
    (l, i) => i > start && l === `Program ${DVP_PROGRAM} success`,
  );
  const programLogs = start >= 0 && end >= 0 ? logs.slice(start, end + 1) : [];

  const sizeBytes = base64Length(f.wireBase64);
  const signatures = tx.transaction.signatures.length;
  return {
    signature: f.signature,
    cash: units(BigInt(f.cashAmount), 6),
    asset: units(BigInt(f.assetAmount), 6),
    slot: tx.slot,
    version: String(tx.version),
    sizeBytes,
    messageBytes: sizeBytes - compactU16Length(signatures) - 64 * signatures,
    maxBytes: MAX_TRANSACTION_BYTES,
    numRequiredSignatures: signedCount,
    feePayer: accounts[0],
    recentBlockhash: message.recentBlockhash,
    accounts,
    instructions,
    cpis,
    fee: tx.meta.fee,
    computeUnits: tx.meta.computeUnitsConsumed ?? null,
    succeeded: tx.meta.err === null,
    status: tx.meta.status,
    logs,
    programLogs,
    balances,
  };
}

/** The trimmed getTransaction response shown in the Result step. */
export function trimmedResponse(f: RecordedFixture, model: WalkthroughModel) {
  const { meta } = f.getTransaction;
  return {
    slot: f.getTransaction.slot,
    meta: {
      err: meta.err,
      status: meta.status,
      fee: meta.fee,
      computeUnitsConsumed: meta.computeUnitsConsumed,
      // The DvP instruction's lines; "…" marks the lines left out.
      logMessages: [
        ...(model.logs[0] === model.programLogs[0] ? [] : ["…"]),
        ...model.programLogs,
        ...(model.logs.at(-1) === model.programLogs.at(-1) ? [] : ["…"]),
      ],
    },
  };
}
