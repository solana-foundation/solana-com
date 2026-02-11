import { DevelopersNftsPage } from "./developers-nfts";
import { getIndexMetadata } from "@/app/metadata";
import { META } from "@/data/developers/nfts";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersNftsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "developers-nfts.meta.seoTitle",
    descriptionKey: "developers-nfts.meta.seoDescription",
    path: "/developers/nfts",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [META.seoImage],
    },
  };
}
