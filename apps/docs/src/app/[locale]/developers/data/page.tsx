import type { Metadata } from "next";
import { Suspense } from "react";
import { getAlternates } from "@workspace/i18n/routing";
import { SolanaDataDashboard } from "./solana-data-dashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

const title = "Solana Data";
const description = "Explore live Solana network and stablecoin metrics.";

export const revalidate = 3600;

export default function DataDashboard() {
  return (
    <Suspense fallback={<DataDashboardLoading />}>
      <SolanaDataDashboard />
    </Suspense>
  );
}

function DataDashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-6 dark:bg-[#050506] sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1600px] gap-4">
        <div className="h-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-28 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900"
              key={index}
            />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-[420px] animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900"
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title,
    description,
    alternates: getAlternates("/developers/data", locale),
  };
}
