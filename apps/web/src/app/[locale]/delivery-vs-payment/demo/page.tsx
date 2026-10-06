import type { Metadata } from "next";
import { getBaseMetadata } from "@/app/metadata";
import { getTranslations } from "@workspace/i18n/server";
import { DvpDemo } from "./dvp-demo";

type Props = { params: Promise<{ locale: string }> };

export default function Page() {
  return <DvpDemo />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "deliveryVsPayment.metadata",
  });
  return {
    ...getBaseMetadata(locale),
    title: t("demoTitle"),
    description: t("demoDescription"),
    robots: { index: false, follow: false },
  };
}
