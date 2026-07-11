"use client";

import {
  transactionEndpoints,
  accountsEndpoints,
  cheatcodeEndpoints,
  nodeEndpoints,
  networkEndpoints,
  adminEndpoints,
  type Endpoint,
} from "@/lib/rpc-endpoints";
import { RpcMethodSolana } from "./RpcMethodSolana";

interface RpcPageContentProps {
  category:
    | "transactions"
    | "accounts"
    | "cheatcodes"
    | "node"
    | "network"
    | "admin";
}

const categoryEndpoints: Record<string, Endpoint[]> = {
  transactions: transactionEndpoints,
  accounts: accountsEndpoints,
  cheatcodes: cheatcodeEndpoints,
  node: nodeEndpoints,
  network: networkEndpoints,
  admin: adminEndpoints,
};

const categoryDescriptions: Record<string, string> = {
  transactions:
    "These methods handle the creation, simulation, and inspection of transactions on the blockchain. They are essential for executing state changes, estimating fees, checking transaction outcomes, and monitoring transaction lifecycles.",
  accounts:
    "Query account states, balances, token holdings, and program-specific storage data.",
  cheatcodes:
    "Powerful testing utilities unique to Surfpool that allow you to directly modify account and token states. These methods are only available on Surfnet.",
  node: "Monitor node status, health checks, cluster information, and validator details.",
  network:
    "Access network-wide information like epoch data, inflation rates, and performance metrics.",
  admin:
    "Administrative controls for managing the Surfnet instance, plugins, and system configuration.",
};

export function RpcPageContent({ category }: RpcPageContentProps) {
  const endpoints = categoryEndpoints[category] || [];
  const description = categoryDescriptions[category] || "";

  return (
    <div>
      <p className="text-fd-muted-foreground text-base leading-relaxed mb-10">
        {description}
      </p>

      {endpoints.map((endpoint, index) => {
        const id = endpoint.method_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");
        return (
          <div key={index} id={id}>
            <RpcMethodSolana endpoint={endpoint} />
          </div>
        );
      })}
    </div>
  );
}

// Export individual category components for easier MDX usage
export function TransactionsRpc() {
  return <RpcPageContent category="transactions" />;
}

export function AccountsRpc() {
  return <RpcPageContent category="accounts" />;
}

export function CheatcodesRpc() {
  return <RpcPageContent category="cheatcodes" />;
}

export function NodeRpc() {
  return <RpcPageContent category="node" />;
}

export function NetworkRpc() {
  return <RpcPageContent category="network" />;
}

export function AdminRpc() {
  return <RpcPageContent category="admin" />;
}
