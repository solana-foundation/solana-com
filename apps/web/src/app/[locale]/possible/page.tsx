import { PossiblePage } from "./possible";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return <PossiblePage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "possible.meta.title",
    descriptionKey: "possible.meta.description",
    path: "/possible",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: ["https://solana.com/social/possible.jpg"],
    },
  };
}
