import { ValidatorsPage } from "./validators";
import { getIndexMetadata } from "@/app/metadata";
import { getDisplayMetrics } from "@/lib/metrics/present";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics([
    "network.validator-count",
    "network.nakamoto-coefficient",
  ]);

  return (
    <ValidatorsPage
      metrics={{
        validatorCount: metrics["network.validator-count"],
        nakamotoCoefficient: metrics["network.nakamoto-coefficient"],
      }}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "validators.title",
    descriptionKey: "validators.description",
    path: "/validators",
    locale,
  });
}
