import { DevelopersEvmToSvmSmartContractsPage } from "./developers-evm-to-svm-smart-contracts";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersEvmToSvmSmartContractsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("developers-evm-to-svm-smart-contracts");
  return {
    title: t("meta.seoTitle"),
    description: t("meta.seoDescription"),
    alternates: getAlternates("/developers/evm-to-svm/smart-contracts", locale),
  };
}
