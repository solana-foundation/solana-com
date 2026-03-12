import { DevelopersEvmToSvmErc4626Page } from "./developers-evm-to-svm-erc4626";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersEvmToSvmErc4626Page />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("developers-evm-to-svm-erc4626");
  return {
    title: t("meta.seoTitle"),
    description: t("meta.seoDescription"),
    alternates: getAlternates("/developers/evm-to-svm/erc4626", locale),
  };
}
