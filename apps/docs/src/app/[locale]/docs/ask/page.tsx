import type { Metadata } from "next";
import { AskPage } from "@@/src/app/components/ask-page";

export const metadata: Metadata = {
  title: "Ask Solana Docs",
  robots: { index: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 1000) ?? "";

  return <AskPage key={query} initialQuery={query} />;
}
