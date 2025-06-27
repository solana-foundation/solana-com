import { notFound } from "next/navigation";
import { learnSource } from "@/app/sources/learn";
import { mdxComponents } from "@/app/mdx-components";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export async function generateStaticParams() {
  return learnSource.generateParams();
}

export async function generateMetadata(props: Props) {
  const { locale, slug } = await props.params;
  const page = learnSource.getPage(slug, locale);

  if (!page) {
    notFound();
  }

  const data = await page.data;

  return {
    title: data.seoTitle || data.title,
    description: data.description,
  };
}

export default async function LearnContentPage(props: Props) {
  const { locale, slug } = await props.params;

  const page = learnSource.getPage(slug, locale);

  if (!page) {
    notFound();
  }

  const data = await page.data;
  const { body: MDX, toc } = await data.load();

  return (
    <div className="container-fluid py-8 md:py-12">
      <div className="container">
        <div className="relative flex justify-center">
          <div className="w-full max-w-4xl px-4">
            <article>
              <header className="mb-8">
                <h1 className="h1 mb-4">{data.h1 || data.title}</h1>
                {data.description && (
                  <p className="lead text-white">{data.description}</p>
                )}
              </header>

              <div className="prose prose-lg max-w-none">
                <MDX components={mdxComponents} />
              </div>
            </article>
          </div>

          {!data.hideTableOfContents && toc && toc.length > 0 && (
            <aside className="hidden xl:block sticky top-24 h-fit ml-8 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <InlineTOC items={toc} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
