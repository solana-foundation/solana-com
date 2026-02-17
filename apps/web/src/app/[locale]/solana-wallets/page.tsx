import { SolanaWalletsPage } from "./solana-wallets";
import { getIndexMetadata } from "@/app/metadata";
import { walletData } from "@/data/wallets/wallet-data";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const randomizedWallets = [...walletData].sort(() => Math.random() - 0.5);

  return <SolanaWalletsPage walletData={randomizedWallets} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "wallets.meta.title",
    descriptionKey: "wallets.meta.description",
    path: "/solana-wallets",
    locale,
  });
}
