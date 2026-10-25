import type { Metadata } from "next";
import { DocsNotFound } from "@/components/docs/docs-not-found";

// The tab title the docs 404 has always had.
export const metadata: Metadata = { title: { absolute: "Page Not Found" } };

export default function NotFound() {
  return <DocsNotFound />;
}
