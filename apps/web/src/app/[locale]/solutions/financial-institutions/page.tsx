import { SolutionsFinancialInstitutionsPage } from "./solutions-financial-institutions";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  return <SolutionsFinancialInstitutionsPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("financial-institutions-solution");
  return {
    title: t("meta.seoTitle"),
    description: t("meta.seoDescription"),
    alternates: getAlternates("/solutions/financial-institutions", locale),
  };
}
