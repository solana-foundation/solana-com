import { docsSource } from "@@/src/app/sources/docs";
import { getMetadataFromSlug, TokenizationDocsPage } from "../tokenization";
import { toStaticParams } from "@@/src/app/sources/utils";

type Props = {
  params: Promise<{ slug: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slug, locale } = await props.params;
  return (
    <TokenizationDocsPage slug={["tokenization", ...slug]} locale={locale} />
  );
}

export async function generateStaticParams() {
  return toStaticParams(docsSource)
    .filter((param) => param.slug[0] === "tokenization")
    .map((param) => ({ slug: param.slug.slice(1) }))
    .filter((param) => param.slug.length > 0);
}

export async function generateMetadata(props: Props) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(["tokenization", ...slug], locale);
}
