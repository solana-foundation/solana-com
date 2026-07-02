import type { Metadata } from "next";
import { Suspense } from "react";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { cn } from "@/app/components/utils";
import { SolanaDataDashboard } from "./solana-data-dashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
const SOCIAL_IMAGE = "/social/solana-data.webp";

export default function DataDashboard() {
  return (
    <Suspense fallback={<DataDashboardLoading />}>
      <SolanaDataDashboard />
    </Suspense>
  );
}

function DataDashboardLoading() {
  return (
    <div className="bg-nd-inverse font-brand">
      <div className="max-w-screen-2xl w-full mx-auto px-5 md:px-8 xl:px-10 py-10 xl:py-16 grid gap-10">
        <div className="h-24 animate-pulse bg-nd-border-light/40" />
        <div className="grid grid-cols-2 xl:grid-cols-4 border-y border-nd-border-light">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className={cn(
                "h-32 animate-pulse bg-nd-border-light/30 border-nd-border-light",
                index > 0 ? "border-l" : "",
              )}
              key={index}
            />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 border-x border-b border-nd-border-light">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className={cn(
                "h-[420px] animate-pulse bg-nd-border-light/20 border-nd-border-light",
                index % 2 === 1 ? "lg:border-l" : "",
                index >= 2 ? "border-t" : "",
              )}
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
  const t = await getTranslations({
    locale,
    namespace: "dataDashboard.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates("/data", locale),
    openGraph: {
      images: [SOCIAL_IMAGE],
    },
  };
}
