import { PlayGGPage } from "./playgg";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return <PlayGGPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "playgg.title",
    descriptionKey: "playgg.description",
    path: "/playgg",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: ["https://solana.com/social/playgg.jpg"],
    },
  };
}
