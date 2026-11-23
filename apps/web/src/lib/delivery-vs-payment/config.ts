/**
 * Public, non-secret configuration shared by client and server.
 * The RPC endpoint and treasury key live server-side only (see src/lib/server).
 */

/** Deployed DvP program (devnet). Same address the vendored client is pinned to. */
export const PROGRAM_ID = "dvp34bdbcEm4f4FCUjGV4mDAkDshaQR4LkK8fdcsyZq";

export const CLUSTER = "devnet";

/** Solana Explorer link for a signature or address on devnet. */
export function explorerTx(sig: string): string {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}
export function explorerAddress(addr: string): string {
  return `https://explorer.solana.com/address/${addr}?cluster=devnet`;
}

/** The two demo tokens the swap moves. Mint addresses are derived server-side. */
export interface TokenMeta {
  /** Stable key used in derivation + role wiring. */
  key: "asset" | "cash";
  symbol: string;
  name: string;
  decimals: number;
}

export const ASSET_TOKEN: TokenMeta = {
  key: "asset",
  symbol: "TBILL",
  name: "Tokenized T-Bill",
  decimals: 2,
};

export const CASH_TOKEN: TokenMeta = {
  key: "cash",
  symbol: "dUSD",
  name: "Demo Stablecoin",
  decimals: 6,
};

/** The preset trade: Party A delivers the asset, Party B delivers the cash. */
export const PRESET = {
  /** 100.00 TBILL */
  amountA: 100_00n,
  /** 10,000.000000 dUSD */
  amountB: 10_000_000_000n,
  /** Seconds from creation until settlement is refused. */
  expirySeconds: 60 * 60,
};

/** Starting token balances for each fresh demo run, in base units. */
export const DEMO_BALANCES = {
  asset: 250_00n,
  cash: 25_000_000_000n,
};

export type RoleKey = "maker" | "partyA" | "partyB" | "authority";

export interface RoleMeta {
  key: RoleKey;
  label: string;
  blurb: string;
}

export const ROLES: RoleMeta[] = [
  { key: "maker", label: "Maker", blurb: "Defines the trade" },
  {
    key: "partyA",
    label: "Party A · Seller",
    blurb: `Delivers the asset (${ASSET_TOKEN.symbol})`,
  },
  {
    key: "partyB",
    label: "Party B · Buyer",
    blurb: `Delivers the cash (${CASH_TOKEN.symbol})`,
  },
  {
    key: "authority",
    label: "Settlement Authority",
    blurb: "The only party who can settle atomically",
  },
];
