import { notFound } from "next/navigation";
import { DocsPage } from "@@/src/app/components/docs-page";
import { getMdxMetadata } from "@@/src/app/metadata";
import { mdxComponents } from "@@/src/app/mdx-components";
import { developersLearnSource } from "@@/src/app/sources/developers-learn";
import { DocsCategory } from "fumadocs-ui/page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page(props: Props) {
  const { locale } = await props.params;
  const page = developersLearnSource.getPage([], locale);
  if (!page) {
    notFound();
  }

  const { body: MDX, toc } = await page.data.load();
  const markdown = await page.data.getText("raw");

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      title={page.data.h1 || page.data.title}
      filePath={page.data.info.path}
      hideTableOfContents={page.data.hideTableOfContents}
      pageTree={developersLearnSource.pageTree[locale]}
      href={page.url}
      markdown={markdown}
      rootHref="/developers/bootcamp"
      breadcrumbEnabled={false}
      showPageActions={false}
      editPathPrefix="content/developers-learn"
    >
      <MDX components={mdxComponents} />
      {page.data.index ? (
        <DocsCategory page={page} from={developersLearnSource as any} />
      ) : null}
    </DocsPage>
  );
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  const page = developersLearnSource.getPage([], locale);
  if (!page) {
    notFound();
  }

  return getMdxMetadata(page);
}
