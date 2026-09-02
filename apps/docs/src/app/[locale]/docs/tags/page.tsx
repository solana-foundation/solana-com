import { getMdxMetadata } from "@@/src/app/metadata";
import { docsSource } from "@@/src/app/sources/docs";
import { notFound } from "next/navigation";
import { DocumentationTagsIndexPage } from "./tag-pages";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <DocumentationTagsIndexPage locale={locale} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const page = docsSource.getPage(["tags"], locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
