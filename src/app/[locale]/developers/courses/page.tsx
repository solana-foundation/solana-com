import { coursesSource } from "@/app/sources/courses";
import Courses from "./courses-index";

import { DefaultCard } from "@solana-foundation/solana-lib/dist/components/CardDeck/DefaultCard/defaultCard";
import { toUrlWithoutLocale } from "@/app/sources/utils";
import { getIndexMetadata } from "@/app/metadata";

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

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  return await getIndexMetadata({
    titleKey: "developers.courses.title",
    descriptionKey: "developers.courses.seo-description",
    path: "/developers/courses",
    locale,
  });
}
