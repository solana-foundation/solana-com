import {
  accountsEndpoints,
  adminEndpoints,
  cheatcodeEndpoints,
  networkEndpoints,
  nodeEndpoints,
  transactionEndpoints,
  type Endpoint,
} from "@/lib/rpc-endpoints";

/**
 * A Surfpool RPC reference category. Each value is also the file name of the
 * page that renders it, under `content/docs/<locale>/tools/surfpool/rpc/`.
 */
export type RpcCategory =
  | "transactions"
  | "accounts"
  | "cheatcodes"
  | "node"
  | "network"
  | "admin";

/**
 * Single source of truth for which endpoints render on which category page.
 *
 * Read by `RpcPageContent` (client — renders an `<h3 id={method_name}>` per
 * endpoint) and by `getRpcEndpointToc` (server — indexes those headings into a
 * table of contents). Keep this module free of `"use client"` so both graphs can
 * import it.
 */
export const rpcCategoryEndpoints: Record<RpcCategory, Endpoint[]> = {
  transactions: transactionEndpoints,
  accounts: accountsEndpoints,
  cheatcodes: cheatcodeEndpoints,
  node: nodeEndpoints,
  network: networkEndpoints,
  admin: adminEndpoints,
};
