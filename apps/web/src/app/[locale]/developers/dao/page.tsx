import { DevelopersDaoPage } from "./developers-dao";
import { getIndexMetadata } from "@/app/metadata";
import { META, STATS_METRICS } from "@/data/developers/dao";
import { getDisplayMetrics } from "@/lib/metrics/present";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics(STATS_METRICS);

  return (
    <DevelopersDaoPage
      statsMetrics={STATS_METRICS.map((key) => metrics[key])}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "developers-dao.meta.seoTitle",
    descriptionKey: "developers-dao.meta.seoDescription",
    path: "/developers/dao",
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
