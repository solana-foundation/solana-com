import type { RoleKey } from "@/lib/delivery-vs-payment/config";
import type { TradeTerms } from "@/lib/delivery-vs-payment/solana/dvp";
import type { DvpAddresses } from "@/lib/delivery-vs-payment/solana/pdas";

export type StageKey =
  | "parties"
  | "assets"
  | "trade"
  | "asset"
  | "cash"
  | "settle";
export type StageState = {
  status: "waiting" | "running" | "complete" | "error";
  signatures?: string[];
  error?: string;
};
export type CompletedRun = {
  stages: Record<StageKey, StageState>;
  roles: Record<RoleKey, string>;
  mints: { asset: string; cash: string };
  dvpAddresses: DvpAddresses;
  terms: TradeTerms;
};

export const PARTY_META: Record<
  RoleKey,
  {
    label: string;
    name: string;
    action: string;
    description: string;
    dotClass: string;
    textClass: string;
    selectedClass: string;
  }
> = {
  maker: {
    label: "Maker",
    name: "Maker",
    action: "Defines the terms",
    description:
      "Defines what changes hands, the two counterparties, the expiry, and who can settle. The demo treasury submits the trade and covers its fees.",
    dotClass: "bg-nd-highlight-lavendar",
    textClass: "text-nd-highlight-lavendar",
    selectedClass:
      "border-nd-highlight-lavendar bg-nd-highlight-lavendar/[0.08]",
  },
  partyA: {
    label: "Seller · Party A",
    name: "Seller",
    action: "Delivers 100 TBILL",
    description:
      "Sends 100 TBILL into the asset escrow with a normal token transfer. At settlement, receives 10,000 dUSD from the buyer in exchange.",
    dotClass: "bg-nd-highlight-blue",
    textClass: "text-nd-highlight-blue",
    selectedClass: "border-nd-highlight-blue bg-nd-highlight-blue/[0.08]",
  },
  partyB: {
    label: "Buyer · Party B",
    name: "Buyer",
    action: "Pays 10,000 dUSD",
    description:
      "Sends 10,000 dUSD into the payment escrow with a normal token transfer. At settlement, receives the seller’s 100 TBILL in the same transaction.",
    dotClass: "bg-nd-highlight-green",
    textClass: "text-nd-highlight-green",
    selectedClass: "border-nd-highlight-green bg-nd-highlight-green/[0.08]",
  },
  authority: {
    label: "Settlement authority",
    name: "Authority",
    action: "Settles both legs",
    description:
      "The only party authorized to settle. Once both escrows are funded, releases both legs together, closes the trade and escrows, and receives their returned rent.",
    dotClass: "bg-nd-highlight-orange",
    textClass: "text-nd-highlight-orange",
    selectedClass: "border-nd-highlight-orange bg-nd-highlight-orange/[0.08]",
  },
};

export const STAGES: Array<{
  key: StageKey;
  title: string;
  description: string;
  actor: RoleKey;
  actorLabel: string;
}> = [
  {
    key: "parties",
    title: "Create the parties",
    description:
      "Generate four fresh demo identities. No wallet connection needed.",
    actor: "maker",
    actorLabel: "Demo setup",
  },
  {
    key: "assets",
    title: "Prepare test tokens",
    description:
      "Issue 250 TBILL to the seller and 25,000 dUSD to the buyer. The treasury sponsors every fee.",
    actor: "maker",
    actorLabel: "Demo treasury",
  },
  {
    key: "trade",
    title: "Record the trade",
    description:
      "Record the agreed amounts, parties, authority, and one-hour expiry onchain. Create an escrow for each leg.",
    actor: "maker",
    actorLabel: "Maker · Treasury submits",
  },
  {
    key: "asset",
    title: "Deposit the asset",
    description:
      "The seller sends 100 TBILL to asset escrow using a standard token transfer. The buyer has not received it yet.",
    actor: "partyA",
    actorLabel: "Seller · Party A",
  },
  {
    key: "cash",
    title: "Deposit the payment",
    description:
      "The buyer sends 10,000 dUSD to payment escrow. With both legs funded, the trade is ready to settle.",
    actor: "partyB",
    actorLabel: "Buyer · Party B",
  },
  {
    key: "settle",
    title: "Settle atomically",
    description:
      "The authority sends TBILL to the buyer and dUSD to the seller in one transaction. The trade and both escrows close.",
    actor: "authority",
    actorLabel: "Settlement authority",
  },
];

export const initialStages = (): Record<StageKey, StageState> =>
  Object.fromEntries(
    STAGES.map(({ key }) => [key, { status: "waiting" }]),
  ) as Record<StageKey, StageState>;
