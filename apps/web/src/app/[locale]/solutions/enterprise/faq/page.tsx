import { EnterpriseFaqPage } from "./enterprise-faq";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default function Page() {
  return <EnterpriseFaqPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();

  return {
    title: t("enterpriseFaq.meta.seoTitle"),
    description: t("enterpriseFaq.meta.seoDescription"),
    alternates: getAlternates("/solutions/enterprise/faq", locale),
  };
}
