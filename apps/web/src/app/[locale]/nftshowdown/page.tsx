import { NFTShowdownPage } from "./nftshowdown";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <NFTShowdownPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "nft-showdown.title",
    descriptionKey: "nft-showdown.description",
    path: "/nftshowdown",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: ["https://solana.com/social/nftshowdown.jpg"],
    },
  };
}
