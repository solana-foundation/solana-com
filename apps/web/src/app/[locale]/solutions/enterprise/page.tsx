import { SolutionsEnterprisePage } from "./solutions-enterprise";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <SolutionsEnterprisePage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("partners");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/enterprise", locale),
  };
}
