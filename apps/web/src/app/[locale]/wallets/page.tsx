import { getIndexMetadata } from "@/app/metadata";
import { WalletDirectory } from "@/components/wallets/WalletDirectory";
import { getWalletDirectoryData } from "@/lib/wallets/get-wallet-directory";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 604800;

export default async function Page() {
  const walletDirectoryData = await getWalletDirectoryData();

  return <WalletDirectory data={walletDirectoryData} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "wallets.meta.title",
    descriptionKey: "wallets.meta.description",
    path: "/wallets",
    locale,
  });
}
