/**
 * Preview Plugin for TinaCMS
 *
 * Adds preview functionality to the Tina admin interface.
 */

/**
 * Collection to URL mapping for preview
 */
const COLLECTION_ROUTES: Record<string, (relativePath: string) => string> = {
  post: (relativePath) => {
    const slug = relativePath.replace(".mdx", "");
    return `/en/news/${slug}`;
  },
  podcast: (relativePath) => {
    const slug = relativePath.replace(".mdx", "");
    return `/en/podcasts/${slug}`;
  },
  category: (relativePath) => {
    const slug = relativePath.replace(".mdx", "");
    return `/en/news/category/${slug}`;
  },
};

/**
 * Get the preview URL for a document
 */
export function getPreviewUrl(
  collection: string,
  relativePath: string
): string | null {
  const routeGenerator = COLLECTION_ROUTES[collection];
  if (!routeGenerator) {
    return null;
  }
  return routeGenerator(relativePath);
}

/**
 * Open preview in a new tab
 */
export function openPreview(collection: string, relativePath: string): void {
  const previewPath = getPreviewUrl(collection, relativePath);
  if (!previewPath) {
    console.warn(`No preview route defined for collection: ${collection}`);
    return;
  }

  // Use the draft API to enable preview mode
  const previewUrl = `/api/draft?slug=${encodeURIComponent(previewPath)}`;
  window.open(previewUrl, "_blank");
}

/**
 * Create a preview button event handler
 * Can be used in custom form components
 */
export function createPreviewHandler(
  collection: string,
  relativePath: string
): () => void {
  return () => openPreview(collection, relativePath);
}
