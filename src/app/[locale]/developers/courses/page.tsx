import { coursesSource } from "@/app/sources/courses";
import Courses from "./courses-index";

import { DefaultCard } from "@solana-foundation/solana-lib/dist/components/CardDeck/DefaultCard/defaultCard";
import { getAlternates } from "@/i18n/routing";
import { toUrlWithoutLocale } from "@/app/sources/utils";
import { serverTranslation } from "@/i18n/translation";
import { ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page(props: Props) {
  const { locale } = await props.params;
  const courses = coursesSource.pageTree[locale].children;

  const courseCards: Array<DefaultCard> = courses
    .filter((c: any) => c.index)
    .map(({ index, children }: any) => {
      const length = children.length;
      const url = toUrlWithoutLocale(index.url, locale);
      return {
        type: "blog",
        eyebrow: length > 0 && `${length} Lessons`,
        body: index.description,
        callToAction: {
          hierarchy: "link",
          size: "md",
          label: "Start Course",
          endIcon: "arrow-up-right",
          iconSize: "sm",
          url,
        },
        backgroundImage: {
          src: `/opengraph${url}`,
        },
        isFeatured: false,
      };
    });

  return <Courses courseCards={courseCards} />;
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
) {
  const { locale } = await props.params;
  const { t } = await serverTranslation(locale);
  const { openGraph } = await parent;

  return {
    title: t("developers.courses.title"),
    description: t("developers.courses.seo-description"),
    openGraph: {
      ...openGraph,
      title: t("developers.courses.title"),
      description: t("developers.courses.seo-description"),
    },
    alternates: getAlternates("/developers/courses", locale),
  };
}
