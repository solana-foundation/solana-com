import { NavigationHubPage } from "@/components/navigation-migration/hub-page";
import { navigationHubs } from "@/data/navigation-hubs";
import { getAlternates } from "@workspace/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default function Page() {
  return <NavigationHubPage config={navigationHubs.useSolana} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const { metaTitle, metaDescription, path } = navigationHubs.useSolana;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: getAlternates(path, locale),
  };
}
