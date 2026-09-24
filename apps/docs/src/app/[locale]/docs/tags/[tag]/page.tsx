import { getAlternates } from "@workspace/i18n/routing";
import { staticLocales } from "@workspace/i18n/config";
import { docsSource } from "@@/src/app/sources/docs";
import {
  getDocumentationTag,
  getDocumentationTags,
  getDocumentationTagUrl,
} from "@@/src/app/sources/documentation-tags";
import { notFound } from "next/navigation";
import { DocumentationTagDetailPage } from "../tag-pages";

type Props = { params: Promise<{ locale: string; tag: string }> };

export default async function Page({ params }: Props) {
  const { locale, tag } = await params;
  return <DocumentationTagDetailPage locale={locale} slug={tag} />;
}

export function generateStaticParams() {
  return staticLocales.flatMap((locale) =>
    getDocumentationTags(docsSource.getPages(locale)).map(({ slug }) => ({
      locale,
      tag: slug,
    })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, tag: slug } = await params;
  const tag = getDocumentationTag(docsSource.getPages(locale), slug);
  if (!tag) notFound();

  const title = `${tag.label} documentation`;
  const description =
    tag.summary ?? `Browse Solana documentation tagged with ${tag.label}.`;

  return {
    title,
    description,
    alternates: getAlternates(getDocumentationTagUrl("en", tag.slug), locale),
  };
}
