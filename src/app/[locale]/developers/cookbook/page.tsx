import { CookbookPage, getMetadataFromSlug } from "./cookbook";

export default async function Page() {
  // We use an index page instead of an optional catch-all route
  // because the optional catch-all route is 404ing in Vercel for localized routes
  // similar to https://github.com/vercel/next.js/issues/62657
  return <CookbookPage slug={[]} />;
}

export async function generateMetadata() {
  return getMetadataFromSlug([]);
}
