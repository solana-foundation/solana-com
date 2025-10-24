import { TemplatesUiLayoutDetail } from "@/components/templates/templates-ui-layout-detail";
import { fetchTemplatesFromGitHub } from "@/lib/fetch-templates";
import { AppProviders } from "@/components/app-providers";
import { TemplatesProviderWrapper } from "@/components/providers/templates-provider-wrapper";
import { BackgroundShapes } from "@/components/background-shapes";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const templates = await fetchTemplatesFromGitHub();
  return templates.map((template) => ({
    id: template.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const templates = await fetchTemplatesFromGitHub();
  const template = templates.find((t) => t.name === id);

  if (!template) {
    return {
      title: "Template Not Found",
      description: "The requested template could not be found.",
    };
  }

  const displayName = template.displayName || template.name;

  return {
    title: `${displayName} - Solana Template`,
    description: template.description,
    openGraph: {
      title: `${displayName} - Solana Template`,
      description: template.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} - Solana Template`,
      description: template.description,
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const templates = await fetchTemplatesFromGitHub();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-500/5 via-background via-50% to-emerald-400/8">
      <BackgroundShapes />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/3 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-pink-400/3 via-transparent to-transparent pointer-events-none"></div>
      <AppProviders>
        <TemplatesProviderWrapper>
          <div className="relative z-10 container mx-auto px-4 py-8">
            <TemplatesUiLayoutDetail
              name={id}
              source={templates.find((t) => t.name === id)?.source.id || ""}
              templates={templates}
            />
          </div>
        </TemplatesProviderWrapper>
      </AppProviders>
    </div>
  );
}
