/**
 * The actors and the seven steps of the walkthrough. Copy follows the docs
 * house style: plain words, "onchain", Oxford comma. Text in `backticks`
 * renders as inline code. {cash}, {asset}, and {fee} are filled in from the
 * recorded run, not written here.
 */

export type ActorId = "app" | "tx" | "wallet" | "network" | "program" | "token";

export interface Actor {
  id: ActorId;
  name: string;
  note: string;
  /** Code you write: drawn in the accent colour. */
  yours?: boolean;
}

/** Same names as the lanes of diagrams/transaction-flow*.svg. */
export const ACTORS: Record<ActorId, Actor> = {
  app: {
    id: "app",
    name: "Your app",
    note: "Your code, offchain",
    yours: true,
  },
  tx: { id: "tx", name: "Transaction", note: "Not signed yet" },
  wallet: { id: "wallet", name: "Wallet", note: "Signs and pays fees" },
  network: { id: "network", name: "Network", note: "Validators" },
  program: {
    id: "program",
    name: "Your program",
    note: "The DvP program, onchain",
    yours: true,
  },
  token: { id: "token", name: "Token Program", note: "An existing program" },
};

export type StepId =
  | "build"
  | "sign"
  | "send"
  | "fee"
  | "run"
  | "cpi"
  | "result";

export interface Step {
  id: StepId;
  /** The progress rail label. */
  short: string;
  title: string;
  /** The one-sentence explanation above the scene. */
  say: string;
  /** An optional short line under the data chips. */
  note?: string;
  /** The two actors in the scene, left to right. */
  actors: [ActorId, ActorId];
  /** Excerpt ids (excerpts.ts) behind "Show the code", in order. */
  excerpts: string[];
  /** Inside the program's instruction: all or nothing (steps 5 and 6). */
  atomic?: boolean;
}

export const STEPS: Step[] = [
  {
    id: "build",
    short: "Build",
    title: "Your app builds the transaction",
    say: "Your app asks the DvP (delivery versus payment) program to settle the trade: {cash} USDC for {asset} fund shares.",
    note: "The transaction carries a recent blockhash, so it expires if it isn't processed soon.",
    actors: ["app", "tx"],
    excerpts: ["build", "message"],
  },
  {
    id: "sign",
    short: "Sign",
    title: "The wallet signs",
    say: "The wallet signs with the settlement agent's key. That signature becomes the transaction's ID.",
    note: "The buyer and the seller don't sign here. They agreed to the terms earlier, and the program enforces them.",
    actors: ["app", "wallet"],
    excerpts: ["sign"],
  },
  {
    id: "send",
    short: "Send",
    title: "Sent to the network",
    say: "Your app sends the signed transaction to an RPC node, which passes it to the validators.",
    actors: ["app", "network"],
    excerpts: ["send"],
  },
  {
    id: "fee",
    short: "Check + fee",
    title: "The network checks it and charges the fee",
    say: "A validator checks the signature and charges the {fee}-lamport fee, even if the transaction later fails.",
    actors: ["network", "wallet"],
    excerpts: [],
  },
  {
    id: "run",
    short: "Run program",
    title: "Your program runs",
    say: "The DvP program checks the trade and derives the trade record's address (a program-derived address, or PDA) so it can sign.",
    note: "If a check fails, the program returns an error, such as `LegNotFunded`, and nothing changes.",
    actors: ["network", "program"],
    excerpts: ["checks", "seeds"],
    atomic: true,
  },
  {
    id: "cpi",
    short: "Move tokens",
    title: "CPI to the Token Program",
    say: "Your program can't move tokens itself, so it calls the Token Program. This call is a CPI (cross-program invocation).",
    note: "The trade record signs for the escrows. The {asset} fund shares go to the buyer the same way, through Token-2022.",
    actors: ["program", "token"],
    excerpts: ["cpi", "invoke"],
    atomic: true,
  },
  {
    id: "result",
    short: "Result",
    title: "Your app gets the result",
    say: "Every check passed, so every change is kept. Your app gets the status, fee, and new balances.",
    actors: ["network", "app"],
    excerpts: ["result"],
  },
];
