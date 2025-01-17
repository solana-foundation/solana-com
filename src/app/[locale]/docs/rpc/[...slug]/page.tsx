import { docsSource } from "@/app/sources/docs";
import { getMetadataFromSlug, RpcDocsPage } from "../rpc";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return <RpcDocsPage slug={["rpc", ...params.slug]} />;
}

export async function generateStaticParams() {
  return docsSource
    .generateParams()
    .filter((param) => param.slug[0] === "rpc")
    .map((param) => ({ slug: param.slug.slice(1) }))
    .filter((param) => param.slug.length > 0);
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[]; locale: string }>;
}) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(["rpc", ...slug], locale);
}
