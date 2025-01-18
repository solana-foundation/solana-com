import { docsSource } from "@/app/sources/docs";
import { getMetadataFromSlug, MainDocsPage } from "../docs";
import { toStaticParams } from "@/app/sources/utils";

type Props = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slug, locale } = await props.params;
  return <MainDocsPage slug={slug} locale={locale} />;
}

export async function generateStaticParams() {
  const params = toStaticParams(docsSource)
    .filter((param) => param.slug.length > 0)
    .filter((param) => param.slug[0] !== "rpc");

  return params;
}

export async function generateMetadata(props: Props) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(slug, locale);
}
