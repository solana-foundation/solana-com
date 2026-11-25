import { PossiblePage } from "./possible";
import { getIndexMetadata } from "@/app/metadata";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { POSSIBLE_METRICS } from "@/data/possible";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics(POSSIBLE_METRICS);
  return <PossiblePage carbonMetric={metrics["network.net-carbon-impact"]} />;
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
