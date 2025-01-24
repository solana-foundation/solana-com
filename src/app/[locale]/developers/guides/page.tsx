import { getGuides } from "@/app/sources/guides";
import { GuidesIndex } from "./guides";
import { getAlternates } from "@/i18n/routing";
import { serverTranslation } from "@/i18n/translation";
import { ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page(props: Props) {
  const { locale } = await props.params;
  const guides = getGuides(locale);
  const featured = guides.filter((guide: any) => guide.featured).slice(0, 3);
  return (
    <div className="my-8 px-5 max-w-[1120px] w-full mx-auto">
      <GuidesIndex records={guides} featured={featured} />
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
    title: t("developers.guides.title"),
    description: t("developers.guides.seo-description"),
    openGraph: {
      ...openGraph,
      title: t("developers.guides.title"),
      description: t("developers.guides.seo-description"),
    },
    alternates: getAlternates("/developers/guides", locale),
  };
}
