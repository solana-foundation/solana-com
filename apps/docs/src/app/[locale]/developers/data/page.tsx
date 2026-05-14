import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { DatabricksDashboardEmbed } from "./databricks-dashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

const title = "Solana Data";
const description =
  "Explore Solana network data through an embedded analytics dashboard.";

export const revalidate = 3600;

export default function DataDashboard() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase text-zinc-500">
            Network analytics
          </p>
          <h1 className="text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
            Solana data dashboard
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Explore live network metrics and ecosystem activity from the Solana
            data warehouse.
          </p>
        </header>

        <section aria-label="Solana data dashboard">
          <DatabricksDashboardEmbed />
        </section>
      </div>
    </main>
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
