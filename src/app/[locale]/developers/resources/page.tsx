import { resources } from "@/app/sources/resources";
import { ResourcesIndex } from "./resources";
import { getAlternates } from "@/i18n/routing";
import { serverTranslation } from "@/i18n/translation";
import { ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

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

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
) {
  const { locale } = await props.params;
  const { t } = await serverTranslation(locale);
  const { openGraph } = await parent;

  return {
    title: t("developers.resources-page.title"),
    description: t("developers.resources-page.seo-description"),
    openGraph: {
      ...openGraph,
      title: t("developers.resources-page.title"),
      description: t("developers.resources-page.seo-description"),
    },
    alternates: getAlternates("/developers/resources", locale),
  };
}
