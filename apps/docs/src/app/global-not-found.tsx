import type { Metadata } from "next";
import { defaultLocale } from "@workspace/i18n/config";
import { getDocsBaseMetadata } from "@/app/metadata";
import DocsRootLayout from "@/app/(docs)/[locale]/layout";
import { DocsNotFound } from "@/components/docs/docs-not-found";

// Static, as the docs pages: nothing here reads the request (next-intl
// would otherwise read its headers for the locale).
export const dynamic = "force-static";

export const metadata: Metadata = {
  ...getDocsBaseMetadata(defaultLocale),
  title: { absolute: "Page Not Found" },
  robots: { index: false, follow: true },
};

/**
 * The 404 page of any URL no route answers (next.config.ts
 * `experimental.globalNotFound`): the docs 404 in the docs root layout.
 * src/middleware.ts sends missing docs pages here, so their 404 is a full
 * page in the HTML, not an empty shell the browser fills in after loading
 * the page's JavaScript (as a page's notFound() renders). Prerendered once
 * for every URL, so the header's Ask AI ✨ goes by the URL once hydrated
 * (a /developers/docs one), as the panel does.
 */
export default function GlobalNotFound() {
  return (
    <DocsRootLayout params={Promise.resolve({ locale: defaultLocale })}>
      <DocsNotFound askAi="by-path" />
    </DocsRootLayout>
  );
}
