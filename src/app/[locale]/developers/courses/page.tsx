import { coursesSource } from "@/app/source";
import Courses from "./courses-index";

import { DefaultCard } from "@solana-foundation/solana-lib/dist/components/CardDeck/DefaultCard/defaultCard";

export default function Page() {
  const courses = coursesSource.pageTree.children;

  const courseCards: Array<DefaultCard> = courses
    .filter((c: any) => c.index)
    .map(({ index, children }: any) => {
      const length = children.length;
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
          url: index.url,
        },
        backgroundImage: {
          src: `/opengraph${index.url}`,
        },
        isFeatured: false,
      };
    });

  return <Courses courseCards={courseCards} />;
}