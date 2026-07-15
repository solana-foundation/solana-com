import { getIndexMetadata } from "@/app/metadata";
import { WalletDirectory } from "./WalletDirectory";
import { getWalletDirectoryData } from "./get-wallet-directory";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 604800;

function shuffle<T>(items: T[]) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

export default async function Page() {
  const walletDirectoryData = await getWalletDirectoryData();

  return (
    <WalletDirectory
      data={{
        ...walletDirectoryData,
        wallets: shuffle(walletDirectoryData.wallets),
      }}
    />
  );
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
