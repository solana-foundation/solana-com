import { docsSource } from "@@/src/app/sources/docs";
import { getMetadataFromSlug, FinanceDocsPage } from "../finance";
import { toStaticParams } from "@@/src/app/sources/utils";

type Props = {
  params: Promise<{ slug: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slug, locale } = await props.params;
  return <FinanceDocsPage slug={["finance", ...slug]} locale={locale} />;
}

export async function generateStaticParams() {
  return toStaticParams(docsSource)
    .filter((param) => param.slug[0] === "finance")
    .map((param) => ({ slug: param.slug.slice(1) }))
    .filter((param) => param.slug.length > 0);
}

export async function generateMetadata(props: Props) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(["finance", ...slug], locale);
}
