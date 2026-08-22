import {
  getFeatureActivationStatus,
  LARGER_TRANSACTIONS_FEATURE_ADDRESS,
} from "@/lib/upgrades/feature-activation";

const CLUSTERS = [
  { name: "Testnet", rpcUrl: "https://api.testnet.solana.com" },
  { name: "Devnet", rpcUrl: "https://api.devnet.solana.com" },
  { name: "Mainnet", rpcUrl: "https://api.mainnet-beta.solana.com" },
] as const;

export async function FeatureActivationStatus() {
  const statuses = await Promise.all(
    CLUSTERS.map(({ rpcUrl }) =>
      getFeatureActivationStatus(rpcUrl, LARGER_TRANSACTIONS_FEATURE_ADDRESS),
    ),
  );

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
          {CLUSTERS.map(({ name }, index) => (
            <tr key={name} className="border-b border-white/10">
              <td className="px-6 py-4 text-base text-gray-300">{name}</td>
              <td className="px-6 py-4 text-base text-gray-300">
                {statuses[index]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
