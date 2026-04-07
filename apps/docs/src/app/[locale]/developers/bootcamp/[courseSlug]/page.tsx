import { notFound } from "next/navigation";
import { mdxComponents } from "@@/src/app/mdx-components";
import { getMdxMetadata } from "@@/src/app/metadata";
import { developersLearnSource } from "@@/src/app/sources/developers-learn";
import { DocsPage } from "@@/src/app/components/docs-page";
import {
  developersLearnCourses,
  getDevelopersLearnCourseBySlug,
} from "@/utils/developers-learn-curriculum";
import { DocsCategory } from "fumadocs-ui/page";

type Props = {
  params: Promise<{ locale: string; courseSlug: string }>;
};

export default async function Page(props: Props) {
  const { locale, courseSlug } = await props.params;
  const course = getDevelopersLearnCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const page = developersLearnSource.getPage([courseSlug], locale);
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
      description={page.data.description}
      filePath={page.data.info.path}
      hideTableOfContents={page.data.hideTableOfContents}
      pageTree={developersLearnSource.pageTree[locale]}
      href={page.url}
      markdown={markdown}
      rootHref="/developers/bootcamp"
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

export async function generateStaticParams() {
  return developersLearnCourses.map((course) => ({ courseSlug: course.slug }));
}

export async function generateMetadata(props: Props) {
  const { locale, courseSlug } = await props.params;
  const page = developersLearnSource.getPage([courseSlug], locale);
  if (!page) {
    notFound();
  }

  return getMdxMetadata(page);
}
