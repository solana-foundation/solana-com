import { DevelopersNftsPage } from "./developers-nfts";
import { getIndexMetadata } from "@/app/metadata";
import { META, STATS_METRICS } from "@/data/developers/nfts";
import { getDisplayMetrics } from "@/lib/metrics/present";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics(STATS_METRICS);

  return (
    <DevelopersNftsPage
      statsMetrics={STATS_METRICS.map((key) => metrics[key])}
    />
  );
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
