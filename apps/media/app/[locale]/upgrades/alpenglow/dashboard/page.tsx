import type { Metadata } from "next";
import { Link } from "@workspace/i18n/routing";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { AlpenglowDashboard } from "@/components/upgrades/alpenglow-dashboard/dashboard";

export const metadata: Metadata = {
  title: "Alpenglow Transition Dashboard",
  description:
    "Live Solana consensus metrics tracking the transition from Tower BFT to Alpenglow.",
};

export default function AlpenglowDashboardPage() {
  return (
    <div className="min-h-dvh bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <Link
            href="/upgrades/alpenglow"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#14F195]"
          >
            <ArrowLeft className="size-4" />
            Back to Alpenglow
          </Link>
          <p className="mt-6 text-sm font-medium text-[#14F195]">
            Tower BFT → Alpenglow
          </p>
          <h1 className="mt-1 text-balance text-3xl font-semibold text-white md:text-4xl">
            Consensus dashboard
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 md:px-6 md:py-8 lg:px-8">
        <AlpenglowDashboard />
      </main>
    </div>
  );
}
