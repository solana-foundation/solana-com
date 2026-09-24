import { DevelopersChainMigrationCosmosAppChainPage } from "./developers-chain-migration-cosmos-app-chain";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page() {
  return <DevelopersChainMigrationCosmosAppChainPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations(
    "developers-chain-migration-cosmos-app-chain",
  );
  return {
    title: t("meta.seoTitle"),
    description: t("meta.seoDescription"),
    alternates: getAlternates(
      "/developers/migrate-to-solana/cosmos/app-chain",
      locale,
    ),
  };
}
