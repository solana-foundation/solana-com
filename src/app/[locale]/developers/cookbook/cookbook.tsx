import { cookbookSource } from "@/app/sources/cookbook";
import { DocsPage } from "@/app/components/docs-page";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/app/mdx-components";
import { getMdxMetadata } from "@/app/metadata";

export function CookbookPage({
  slug,
  locale,
}: {
  slug: string[];
  locale: string;
}) {
  const page = cookbookSource.getPage(slug, locale);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
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
