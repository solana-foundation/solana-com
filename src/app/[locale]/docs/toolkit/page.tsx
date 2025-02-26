import { ToolkitDocsPage, getMetadataFromSlug } from "./toolkit";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(props: Props) {
  const { locale } = await props.params;
  // We use an index page instead of an optional catch-all route
  // because the optional catch-all route is 404ing in Vercel for localized routes
  // similar to https://github.com/vercel/next.js/issues/62657
  return <ToolkitDocsPage slug={["toolkit"]} locale={locale} />;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  return getMetadataFromSlug(["toolkit"], locale);
}
