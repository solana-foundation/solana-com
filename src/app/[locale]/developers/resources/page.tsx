import { resources } from "@/app/sources/resources";
import { ResourcesIndex } from "./resources";
import { getAlternates } from "@/i18n/routing";
import { serverTranslation } from "@/i18n/translation";
export default function Page() {
  const featured = resources
    .filter((record: any) => record.featured)
    .slice(0, 3);
  return (
    <div className="my-8 px-5 max-w-[1120px] w-full mx-auto">
      <ResourcesIndex records={resources} featured={featured} />
    </div>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const { t } = await serverTranslation(locale);

  return {
    title: t("developers.resources-page.title"),
    description: t("developers.resources-page.seo-description"),
    openGraph: {
      title: t("developers.resources-page.title"),
      description: t("developers.resources-page.seo-description"),
    },
    alternates: getAlternates("/developers/resources", locale),
  };
}
