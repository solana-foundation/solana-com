import { unstable_cache } from "next/cache";
import { getTranslations } from "next-intl/server";
import {
  getFeatureActivationStatus,
  LARGER_TRANSACTIONS_FEATURE_ADDRESS,
  type FeatureActivationStatus as ActivationStatus,
} from "@/lib/upgrades/feature-activation";

const CLUSTERS = ["Testnet", "Devnet", "Mainnet"] as const;
type Cluster = (typeof CLUSTERS)[number];

const RPC_TIMEOUT_MS = 10_000;
const CACHE_SECONDS = 300;

function rpcUrl(cluster: Cluster): string {
  if (cluster === "Testnet") return "https://api.testnet.solana.com";
  if (cluster === "Devnet") return "https://api.devnet.solana.com";

  return process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
}

const getCachedFeatureActivationStatus = unstable_cache(
  async (cluster: Cluster): Promise<ActivationStatus> =>
    getFeatureActivationStatus(
      rpcUrl(cluster),
      LARGER_TRANSACTIONS_FEATURE_ADDRESS,
      AbortSignal.timeout(RPC_TIMEOUT_MS),
    ),
  ["feature-activation-status"],
  { revalidate: CACHE_SECONDS },
);

async function FeatureActivationStatusRow({ cluster }: { cluster: Cluster }) {
  const t = await getTranslations("upgrades.featureActivation");
  let status: ActivationStatus | null;
  try {
    status = await getCachedFeatureActivationStatus(cluster);
  } catch (error) {
    console.error(
      `Failed to fetch ${cluster} feature activation status:`,
      error,
    );
    status = null;
  }

  function statusLabel(): string {
    if (status === null) return t("unavailable");
    if (status.state === "not-activated") return t("notActivated");
    if (status.state === "active") return t("active");

    return t("liveInEpoch", { epoch: status.epoch });
  }

  return (
    <tr className="border-b border-white/10">
      <td className="px-6 py-4 text-base text-gray-300">{cluster}</td>
      <td className="px-6 py-4 text-base text-gray-300">{statusLabel()}</td>
    </tr>
  );
}

export async function FeatureActivationStatus() {
  const t = await getTranslations("upgrades.featureActivation");

  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse border border-white/10 rounded-lg">
        <thead className="bg-gray-900">
          <tr className="border-b border-white/10">
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">
              {t("columnCluster")}
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white">
              {t("columnStatus")}
            </th>
          </tr>
        </thead>
        <tbody>
          {CLUSTERS.map((cluster) => (
            <FeatureActivationStatusRow key={cluster} cluster={cluster} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
