import { docsSource } from "@/app/source";
import { getMetadataFromSlug, RpcDocsPage } from "../rpc";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return <RpcDocsPage slug={["rpc", ...params.slug]} />;
}

export async function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return getMetadataFromSlug(["rpc", ...params.slug]);
}
