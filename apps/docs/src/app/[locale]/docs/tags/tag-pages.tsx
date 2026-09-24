import { DocsPage } from "@@/src/app/components/docs-page";
import { docsSource } from "@@/src/app/sources/docs";
import {
  getDocumentationTag,
  getDocumentationTags,
  getDocumentationTagUrl,
  type DocumentationTag,
} from "@@/src/app/sources/documentation-tags";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function DocumentationTagsIndexPage({
  locale,
}: {
  locale: string;
}) {
  const page = docsSource.getPage(["tags"], locale);
  if (!page) notFound();

  const tags = getDocumentationTags(docsSource.getPages(locale));
  const markdown = await page.data.getText("raw");

  return (
    <DocsPage
      toc={[]}
      title={page.data.h1 || page.data.title}
      description={page.data.description}
      filePath={page.data.info.path}
      hideTableOfContents
      hidePageNavigation
      href={page.url}
      markdown={markdown}
      isRoot
    >
      <DocumentationTagGrid locale={locale} tags={tags} />
    </DocsPage>
  );
}

export function DocumentationTagDetailPage({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const tag = getDocumentationTag(docsSource.getPages(locale), slug);
  if (!tag) notFound();

  const pageCountLabel = `${tag.pages.length} ${tag.pages.length === 1 ? "page" : "pages"}`;

  return (
    <DocsPage
      toc={[]}
      title={tag.label}
      filePath="src/app/sources/documentation-tags.ts"
      editPathPrefix=""
      hideTableOfContents
      hidePageNavigation
      href={getDocumentationTagUrl(locale, tag.slug)}
      markdown=""
      showPageActions={false}
    >
      {tag.summary ? (
        <p className="mt-0 max-w-3xl text-lg leading-relaxed text-fd-muted-foreground">
          {tag.summary}
        </p>
      ) : null}

      <p className="text-sm font-medium text-fd-muted-foreground">
        {pageCountLabel} tagged with {tag.label}
      </p>

      <ul className="not-prose mt-8 grid list-none gap-4 p-0 md:grid-cols-2">
        {tag.pages.map((page) => (
          <li key={page.url}>
            <Link
              href={page.url}
              className="group flex h-full flex-col rounded-xl border bg-fd-card p-5 no-underline transition-colors hover:bg-fd-accent/80"
            >
              <h2 className="m-0 text-lg font-semibold text-fd-foreground">
                {page.data.title}
              </h2>
              {page.data.description ? (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fd-muted-foreground">
                  {page.data.description}
                </p>
              ) : null}
              <span className="mt-auto pt-4 text-sm font-medium text-fd-primary">
                Read page <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DocsPage>
  );
}

function DocumentationTagGrid({
  locale,
  tags,
}: {
  locale: string;
  tags: DocumentationTag[];
}) {
  if (tags.length === 0) {
    return (
      <section className="not-prose rounded-xl border border-dashed bg-fd-card/40 px-6 py-12 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-lg border bg-fd-background text-xl font-semibold text-fd-muted-foreground">
          #
        </div>
        <h2 className="mb-0 mt-4 text-xl font-semibold text-fd-foreground">
          No documentation tags yet
        </h2>
      </section>
    );
  }

  return (
    <ul className="not-prose grid list-none gap-4 p-0 md:grid-cols-2">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            href={getDocumentationTagUrl(locale, tag.slug)}
            className="group flex h-full gap-4 rounded-xl border bg-fd-card p-5 no-underline transition-colors hover:bg-fd-accent/80"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-fd-background text-lg font-semibold text-fd-muted-foreground">
              #
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-fd-foreground">
                {tag.label}
              </span>
              {tag.summary ? (
                <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-fd-muted-foreground">
                  {tag.summary}
                </span>
              ) : null}
              <span className="mt-2 block text-xs font-medium text-fd-muted-foreground">
                {tag.pages.length} {tag.pages.length === 1 ? "page" : "pages"}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
