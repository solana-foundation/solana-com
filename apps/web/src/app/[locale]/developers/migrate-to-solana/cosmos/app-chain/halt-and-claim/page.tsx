import { AppChainGuide } from "../app-chain-guide";
import {
  NAV_BUTTON_URLS,
  RESOURCE_CARD_URLS,
  RUNBOOK_SECTIONS,
} from "@/data/developers/evm-to-svm/cosmos-app-chain";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page() {
  return (
    <AppChainGuide
      namespace="developers-chain-migration-cosmos-app-chain"
      activeUrl="/developers/migrate-to-solana/cosmos/app-chain/halt-and-claim"
      navButtonUrls={NAV_BUTTON_URLS}
      sections={RUNBOOK_SECTIONS}
      resourceCardUrls={RESOURCE_CARD_URLS}
    />
  );
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
      "/developers/migrate-to-solana/cosmos/app-chain/halt-and-claim",
      locale,
    ),
  };
}
