import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppHero } from "@/components/app-hero";
import { BackgroundShapes } from "@/components/background-shapes";
import { TemplatesUiLayoutList } from "@/components/templates/templates-ui-layout-list";
import { fetchTemplatesFromGitHub } from "@/lib/fetch-templates";
import { AppProviders } from "@/components/app-providers";
import { TemplatesProviderWrapper } from "@/components/providers/templates-provider-wrapper";
import { createDefaultSocialImage } from "@solana-com/ui-chrome/social-image";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Solana Developer Templates",
  description:
    "Build faster with production-ready templates for dApps, DeFi protocols, NFT marketplaces, and more.",
  alternates: {
    canonical: "/developers/templates",
  },
  openGraph: {
    title: "Solana Developer Templates",
    description:
      "Build faster with production-ready templates for dApps, DeFi protocols, NFT marketplaces, and more.",
    type: "website",
    url: "/developers/templates",
    images: [createDefaultSocialImage("Solana Developer Templates")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Developer Templates",
    description:
      "Build faster with production-ready templates for dApps, DeFi protocols, NFT marketplaces, and more.",
    images: [createDefaultSocialImage("Solana Developer Templates")],
  },
};

export default async function TemplatesPage() {
  const templates = await fetchTemplatesFromGitHub();
  const t = await getTranslations("templates");

  return (
    <div className="relative min-h-screen bg-nd-inverse text-nd-high-em-text">
      <BackgroundShapes />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(202,159,245,0.08),transparent_55%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(85,233,171,0.06),transparent_55%)] pointer-events-none"></div>
      <AppProviders>
        <TemplatesProviderWrapper>
          <Suspense>
            <div className="relative z-10 container mx-auto px-4 py-8">
              <AppHero title={t("title")} subtitle={t("subtitle")} />
              <TemplatesUiLayoutList templates={templates} />
            </div>
          </Suspense>
        </TemplatesProviderWrapper>
      </AppProviders>
    </div>
  );
}
