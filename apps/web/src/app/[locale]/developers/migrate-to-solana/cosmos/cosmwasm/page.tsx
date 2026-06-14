import { DevelopersChainMigrationCosmosCosmwasmPage } from "./developers-chain-migration-cosmos-cosmwasm";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page() {
  return <DevelopersChainMigrationCosmosCosmwasmPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("developers-chain-migration-cosmos-cosmwasm");
  return {
    title: t("meta.seoTitle"),
    description: t("meta.seoDescription"),
    alternates: getAlternates(
      "/developers/migrate-to-solana/cosmos/cosmwasm",
      locale,
    ),
  };
}
