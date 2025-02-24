import { docsSource } from "@/app/sources/docs";
import { DocsPage } from "@/app/components/docs-page";
import { mdxComponents } from "@/app/mdx-components";
import { getMdxMetadata } from "@/app/metadata";
import { notFound } from "next/navigation";
import { toStaticParams } from "@/app/sources/utils";

type Props = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slug, locale } = await props.params;
  const page = docsSource.getPage(["toolkit", ...(slug || [])], locale);
  if (!page) notFound();

  const { body: MDX, toc } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      title={page.data.h1 || page.data.title}
      filePath={page.file.path}
      hideTableOfContents={page.data.hideTableOfContents}
      pageTree={docsSource.pageTree[locale]}
      href={page.url}
      locale={locale}
    >
      <MDX components={mdxComponents} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const params = toStaticParams(docsSource)
    .filter((param) => param.slug[0] === "toolkit")
    .map((param) => ({ slug: param.slug.slice(1) }));

  return [{ slug: [] }, ...params.filter((param) => param.slug.length > 0)];
}

export async function generateMetadata(props: Props) {
  const { slug, locale } = await props.params;
  const page = docsSource.getPage(["toolkit", ...(slug || [])], locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
