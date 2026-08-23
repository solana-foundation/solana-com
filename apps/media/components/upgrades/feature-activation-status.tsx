import { unstable_cache } from "next/cache";
import {
  getFeatureActivationStatus,
  LARGER_TRANSACTIONS_FEATURE_ADDRESS,
} from "@/lib/upgrades/feature-activation";

const CLUSTERS = [
  { name: "Testnet", rpcUrl: () => "https://api.testnet.solana.com" },
  { name: "Devnet", rpcUrl: () => "https://api.devnet.solana.com" },
  { name: "Mainnet", rpcUrl: mainnetRpcUrl },
] as const;

function mainnetRpcUrl(): string {
  const key = process.env.HELIUS_API_KEY;
  if (key) return `https://mainnet.helius-rpc.com/?api-key=${key}`;
  // Local/dev fallback — public RPC is rate-limited, fine for these light calls
  return process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
}

const getCachedFeatureActivationStatus = unstable_cache(
  (rpcUrl: string) =>
    getFeatureActivationStatus(
      rpcUrl,
      LARGER_TRANSACTIONS_FEATURE_ADDRESS,
      AbortSignal.timeout(60_000),
    ),
  ["feature-activation-status"],
  { revalidate: 300 },
);

async function FeatureActivationStatusRow({
  name,
  rpcUrl,
}: (typeof CLUSTERS)[number]) {
  let status: string;

  try {
    status = await getCachedFeatureActivationStatus(rpcUrl());
  } catch (error) {
    console.error(`Failed to fetch ${name} feature activation status:`, error);
    status = "Unavailable";
  }

  return (
    <tr className="border-b border-white/10">
      <td className="px-6 py-4 text-base text-gray-300">{name}</td>
      <td className="px-6 py-4 text-base text-gray-300">{status}</td>
    </tr>
  );
}

export function FeatureActivationStatus() {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse border border-white/10 rounded-lg">
        <thead className="bg-gray-900">
          <tr className="border-b border-white/10">
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">
              Cluster
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">
              Activation status
            </th>
          </tr>
        </thead>
        <tbody>
          {CLUSTERS.map((cluster) => (
            <FeatureActivationStatusRow key={cluster.name} {...cluster} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
