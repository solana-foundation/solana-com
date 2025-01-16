import { cookbookSource } from "@/app/sources/cookbook";
import { CookbookPage, getMetadataFromSlug } from "../cookbook";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return <CookbookPage slug={params.slug} />;
}

export async function generateStaticParams() {
  return cookbookSource
    .generateParams()
    .filter((param) => param.slug.length > 0);
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return getMetadataFromSlug(params.slug);
}
