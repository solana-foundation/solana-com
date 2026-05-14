import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { DatabricksDashboardEmbed } from "./databricks-dashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

const title = "Solana Data";
const description =
  "Explore Solana network data through an embedded analytics dashboard.";

const dashboardSections = [
  {
    title: "Network overview",
    description:
      "High-level activity, transaction volume, and usage trends across the network.",
  },
  {
    title: "Performance",
    description:
      "Throughput, block production, and other operational metrics for network health.",
  },
  {
    title: "Economic activity",
    description:
      "Fees, token movement, and demand indicators for applications and users.",
  },
  {
    title: "Ecosystem usage",
    description:
      "Program, account, and wallet activity grouped for developer analysis.",
  },
] as const;

export const revalidate = 3600;

export default function DataDashboard() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <header className="grid gap-6 border-b border-zinc-200 pb-8 dark:border-zinc-800 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase text-zinc-500 dark:text-zinc-400">
              Network analytics
            </p>
            <h1 className="text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              Solana data dashboard
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Explore live network metrics and ecosystem activity from the
              Solana data warehouse.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <DashboardStat term="Source" detail="Databricks" />
            <DashboardStat term="Scope" detail="Network data" />
            <DashboardStat term="Access" detail="Public embed" />
          </dl>
        </header>

        <section
          aria-labelledby="dashboard-sections-title"
          className="grid gap-4"
        >
          <div className="max-w-3xl">
            <h2
              id="dashboard-sections-title"
              className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
            >
              Chart groups
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              The embedded dashboard is organized around the core metric groups
              developers use to inspect Solana network activity.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardSections.map((section) => (
              <article
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900/70"
                key={section.title}
              >
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {section.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="dashboard-title" className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="dashboard-title"
                className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
              >
                Analytics dashboard
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Charts render from the public Solana dashboard with a
                short-lived viewer session.
              </p>
            </div>
          </div>

          <DatabricksDashboardEmbed />
        </section>
      </div>
    </main>
  );
}

function DashboardStat({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900/70">
      <dt className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
        {term}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        {detail}
      </dd>
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
