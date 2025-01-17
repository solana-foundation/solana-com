import { docsSource } from "@/app/sources/docs";
import { getMetadataFromSlug, MainDocsPage } from "../docs";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return <MainDocsPage slug={params.slug} />;
}

export async function generateStaticParams() {
  const params = docsSource
    .generateParams()
    .filter((param) => param.slug.length > 0)
    .filter((param) => param.slug[0] !== "rpc");
  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[]; locale: string }>;
}) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(slug, locale);
}
