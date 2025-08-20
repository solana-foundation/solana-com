import { cookbookSource } from "@@/src/app/sources/cookbook";
import { DocsPage } from "@@/src/app/components/docs-page";
import { notFound } from "next/navigation";
import { mdxComponents } from "@@/src/app/mdx-components";
import { getMdxMetadata } from "@@/src/app/metadata";

export async function CookbookPage({
  slug,
  locale,
}: {
  slug: string[];
  locale: string;
}) {
  const page = cookbookSource.getPage(slug, locale);
  if (!page) notFound();

  const { body: MDX, toc } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      title={page.data.h1 || page.data.title}
      filePath={page.file.path}
      hideTableOfContents={true}
      pageTree={cookbookSource.pageTree[locale]}
      href={page.url}
    >
      <MDX components={mdxComponents} />
    </DocsPage>
  );
}

export function getMetadataFromSlug(slug: string[], locale: string) {
  const page = cookbookSource.getPage(slug, locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
