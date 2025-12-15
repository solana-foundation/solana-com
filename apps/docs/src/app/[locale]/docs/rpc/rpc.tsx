import { docsSource } from "@@/src/app/sources/docs";
import { notFound } from "next/navigation";
import { DocsPage } from "@@/src/app/components/docs-page";
import { mdxComponents } from "@@/src/app/mdx-components";
import { getMdxMetadata } from "@@/src/app/metadata";
import { APIMethod } from "@@/src/app/components/api-method";

const rpcMDXComponents = {
  APIMethod,
};

export async function RpcDocsPage({
  slug,
  locale,
}: {
  slug: string[];
  locale: string;
}) {
  const page = docsSource.getPage(slug, locale);
  if (!page) notFound();
  const { body: MDX, toc } = await page.data.load();
  const markdown = await page.data.getText("raw");
  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      title={page.data.h1 || page.data.title}
      filePath={page.data.info.path}
      hideTableOfContents={page.data.hideTableOfContents}
      pageTree={docsSource.pageTree[locale]}
      href={page.url}
      markdown={markdown}
    >
      <MDX components={{ ...mdxComponents, ...rpcMDXComponents }} />
    </DocsPage>
  );
}

export function getMetadataFromSlug(slug: string[], locale: string) {
  const page = docsSource.getPage(slug, locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
