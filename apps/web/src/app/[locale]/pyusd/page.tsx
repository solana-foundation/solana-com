import { PyusdPage } from "./pyusd";
import { getIndexMetadata } from "@/app/metadata";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { STATS_METRICS } from "@/data/pyusd";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const metrics = await getDisplayMetrics(STATS_METRICS);
  return <PyusdPage locale={locale} metrics={metrics} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "pyusd.meta.seoTitle",
    descriptionKey: "pyusd.meta.seoDescription",
    path: "/pyusd",
    locale,
  });
}
