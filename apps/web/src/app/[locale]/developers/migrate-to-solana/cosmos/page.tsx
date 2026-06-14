import { DevelopersChainMigrationCosmosPage } from "./developers-chain-migration-cosmos";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page() {
  return <DevelopersChainMigrationCosmosPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("developers-chain-migration-cosmos");
  return {
    title: t("meta.seoTitle"),
    description: t("meta.seoDescription"),
    alternates: getAlternates("/developers/migrate-to-solana/cosmos", locale),
  };
}
