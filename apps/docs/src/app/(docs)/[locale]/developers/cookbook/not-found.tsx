import type { Metadata } from "next";
import { DocsNotFound } from "@/components/docs/docs-not-found";

// The docs 404's tab title; noindex in place of the layout's "index, follow".
export const metadata: Metadata = {
  title: { absolute: "Page Not Found" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <DocsNotFound />;
}
