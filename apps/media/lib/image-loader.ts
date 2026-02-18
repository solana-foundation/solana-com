/**
 * Custom image loader for the media app.
 *
 * On Vercel preview deployments, media app pages viewed through the web app's
 * domain have image optimization requests that go through a cross-app rewrite
 * chain which can fail. This loader generates absolute URLs pointing directly
 * to the media app's own deployment on preview, bypassing that chain.
 *
 * On production, it uses the standard asset-prefixed relative path so images
 * are served through the normal rewrite chain on solana.com.
 */

const ASSET_PREFIX = "/media-assets";
const MEDIA_ORIGIN = process.env.NEXT_PUBLIC_MEDIA_ORIGIN;
const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Already absolute URL - pass through
  if (src.startsWith("http") || src.startsWith("//")) {
    return src;
  }

  const q = quality || 75;

  // On preview deployments, use the media app's own URL to bypass cross-app
  // rewrite issues. This avoids Vercel URLs appearing on production.
  if (IS_PREVIEW && MEDIA_ORIGIN) {
    return `${MEDIA_ORIGIN}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  // Production & local dev: use asset-prefixed relative URL that goes through
  // the standard rewrite chain (web app → media app)
  return `${ASSET_PREFIX}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
