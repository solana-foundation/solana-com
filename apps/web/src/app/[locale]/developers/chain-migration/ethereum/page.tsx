import { DevelopersChainMigrationEthereumPage } from "./developers-chain-migration-ethereum";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersChainMigrationEthereumPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("developers-evm-to-svm");
  return {
    title: t("evmPage.meta.seoTitle"),
    description: t("evmPage.meta.seoDescription"),
    alternates: getAlternates("/developers/chain-migration/ethereum", locale),
  };
}
