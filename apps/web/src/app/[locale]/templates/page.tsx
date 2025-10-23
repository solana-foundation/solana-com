import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import {
  AppHero,
  TemplatesUiLayoutList,
  fetchTemplatesFromGitHub,
  AppProviders,
  TemplatesProviderWrapper,
} from "@workspace/templates";

export default async function TemplatesPage() {
  const templates = await fetchTemplatesFromGitHub();
  const t = await getTranslations("templates");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-500/5 via-background via-50% to-emerald-400/8">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/3 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-pink-400/3 via-transparent to-transparent pointer-events-none"></div>
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

export async function generateStaticParams() {
  // Generate static page at build time
  return [];
}
