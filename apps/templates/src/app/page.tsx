import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AppHero } from "@/components/app-hero";
import { TemplatesUiLayoutList } from "@/components/templates/templates-ui-layout-list";
import { fetchTemplatesFromGitHub } from "@/lib/fetch-templates";
import { AppProviders } from "@/components/app-providers";
import { TemplatesProviderWrapper } from "@/components/providers/templates-provider-wrapper";

export const revalidate = 3600;

export default async function TemplatesPage() {
  const templates = await fetchTemplatesFromGitHub();
  const t = await getTranslations({ locale: "en" }, "templates");

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
