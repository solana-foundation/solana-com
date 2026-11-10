import { DevelopersDefiPage } from "./developers-defi";
import { getIndexMetadata } from "@/app/metadata";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { STATS_METRICS } from "@/data/developers/defi";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const metrics = await getDisplayMetrics(STATS_METRICS);
  return <DevelopersDefiPage locale={locale} metrics={metrics} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "developers-defi.meta.seoTitle",
    descriptionKey: "developers-defi.meta.seoDescription",
    path: "/developers/defi",
    locale,
  });
}
