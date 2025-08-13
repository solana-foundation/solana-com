import { guidesSource } from "@@/src/app/sources/guides";
import { notFound } from "next/navigation";
import { mdxComponents } from "@@/src/app/mdx-components";
import { BlogPage } from "@@/src/app/components/blog-page";
import { toStaticParams } from "@@/src/app/sources/utils";
import { getMdxMetadata } from "@@/src/app/metadata";

type Props = {
  params: Promise<{ slugs: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slugs, locale } = await props.params;
  const page = guidesSource.getPage(slugs, locale);
  if (!page) notFound();
  const { body: MDX, toc } = await page.data.load();
  return (
    <BlogPage
      toc={toc}
      title={page.data.h1 || page.data.title}
      filePath={page.file.path}
      href={page.url}
      baseHref="/developers/guides"
      breadcrumb={[]}
      tags={page.data.tags}
      date={page.data.date}
      difficulty={page.data.difficulty}
      pageTree={guidesSource.pageTree[locale]}
    >
      <MDX components={mdxComponents} />
    </BlogPage>
  );
}

export async function generateStaticParams() {
  const params = toStaticParams(guidesSource);
  return params.map((p) => ({ slugs: p.slug }));
}

export async function generateMetadata(props: Props) {
  const { slugs, locale } = await props.params;
  const page = guidesSource.getPage(slugs, locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
