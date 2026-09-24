import { docsSource } from "@@/src/app/sources/docs";
import { getMetadataFromSlug, MainDocsPage } from "../../../(main)/docs";
import { getToolsNavigationTree } from "../../../tools/tools-page-tree";
import { toStaticParams } from "@@/src/app/sources/utils";

type Props = {
  params: Promise<{ article: string; locale: string }>;
};

export default async function Page({ params }: Props) {
  const { article, locale } = await params;
  const pageTree = getToolsNavigationTree(docsSource.pageTree[locale]);
  return (
    <MainDocsPage
      slug={["intro", "installation", article]}
      locale={locale}
      pageTree={pageTree}
    />
  );
}

export function generateStaticParams() {
  return toStaticParams(docsSource)
    .filter(
      ({ slug }) =>
        slug.length === 3 && slug[0] === "intro" && slug[1] === "installation",
    )
    .map(({ slug }) => ({ article: slug[2] }));
}

export async function generateMetadata({ params }: Props) {
  const { article, locale } = await params;
  return getMetadataFromSlug(["intro", "installation", article], locale);
}
