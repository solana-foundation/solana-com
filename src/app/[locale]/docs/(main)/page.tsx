import { MainDocsPage, getMetadataFromSlug } from "./docs";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page(props: Props) {
  // We use an index page instead of an optional catch-all route
  // because the optional catch-all route is 404ing in Vercel for localized routes
  // similar to https://github.com/vercel/next.js/issues/62657
  const { locale } = await props.params;
  return <MainDocsPage slug={[]} locale={locale} />;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  return getMetadataFromSlug([], locale);
}
