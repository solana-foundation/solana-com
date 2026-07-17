import { docsSource } from "@@/src/app/sources/docs";
import { getMetadataFromSlug, MainDocsPage } from "../docs";
import { toStaticParams } from "@@/src/app/sources/utils";

type Props = {
  params: Promise<{ slug: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slug, locale } = await props.params;
  return <MainDocsPage slug={slug} locale={locale} />;
}

export async function generateStaticParams() {
  const standaloneDocsSections = new Set(["rpc", "payments", "tools"]);
  const params = toStaticParams(docsSource)
    .filter((param) => param.slug.length > 0)
    .filter((param) => !standaloneDocsSections.has(param.slug[0] ?? ""));

  return params;
}

export async function generateMetadata(props: Props) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(slug, locale);
}
