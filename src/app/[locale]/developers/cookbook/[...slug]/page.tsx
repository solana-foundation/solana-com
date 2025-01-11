import { cookbookSource } from "@/app/source";
import { CookbookPage, getMetadataFromSlug } from "../cookbook";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return <CookbookPage slug={params.slug} />;
}

export async function generateStaticParams() {
  return cookbookSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  return getMetadataFromSlug(params.slug);
}
