import { SolutionsAiPage } from "./solutions-ai";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <SolutionsAiPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("ai-solution");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/ai", locale),
  };
}
