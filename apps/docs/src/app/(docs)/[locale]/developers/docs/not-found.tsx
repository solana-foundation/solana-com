import type { Metadata } from "next";
import { DocsNotFound } from "@/components/docs/docs-not-found";

// The tab title the docs 404 has always had; noindex in place of the
// layout's "index, follow", which would contradict Next's 404 noindex.
export const metadata: Metadata = {
  title: { absolute: "Page Not Found" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <DocsNotFound askAi />;
}
