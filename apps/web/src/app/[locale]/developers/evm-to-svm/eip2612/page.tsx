import { DevelopersEvmToSvmEip2612Page } from "./developers-evm-to-svm-eip2612";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <DevelopersEvmToSvmEip2612Page />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("developers-evm-to-svm-eip2612");
  return {
    title: t("meta.seoTitle"),
    description: t("meta.seoDescription"),
    alternates: getAlternates("/developers/evm-to-svm/eip2612", locale),
  };
}
