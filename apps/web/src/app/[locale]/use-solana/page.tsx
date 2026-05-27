import { NavigationHubPage } from "@/components/navigation-migration/hub-page";
import {
  getNavigationHubConfig,
  getNavigationHubMetadata,
} from "@/data/navigation-hubs";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page() {
  const t = await getTranslations();

  return <NavigationHubPage config={getNavigationHubConfig("useSolana", t)} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();
  const { metaTitle, metaDescription, path } = getNavigationHubMetadata(
    "useSolana",
    t,
  );

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: getAlternates(path, locale),
  };
}
