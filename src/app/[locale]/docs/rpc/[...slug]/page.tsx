import { docsSource } from "@/app/sources/docs";
import { getMetadataFromSlug, RpcDocsPage } from "../rpc";
import { toStaticParams } from "@/app/sources/utils";

type Props = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slug, locale } = await props.params;
  return <RpcDocsPage slug={["rpc", ...slug]} locale={locale} />;
}

export async function generateStaticParams() {
  return toStaticParams(docsSource)
    .filter((param) => param.slug[0] === "rpc")
    .map((param) => ({ slug: param.slug.slice(1) }))
    .filter((param) => param.slug.length > 0);
}

export async function generateMetadata(props: Props) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(["rpc", ...slug], locale);
}
