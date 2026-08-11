import { TemplatesUiLayoutDetail } from "@/components/templates/templates-ui-layout-detail";
import { fetchTemplatesFromGitHub } from "@/lib/fetch-templates";
import { AppProviders } from "@/components/app-providers";
import { TemplatesProviderWrapper } from "@/components/providers/templates-provider-wrapper";
import { BackgroundShapes } from "@/components/background-shapes";
import type { Metadata } from "next";

export const revalidate = 3600;

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
  const canonicalPath = `/developers/templates/${encodeURIComponent(
    template.name,
  )}`;

  return {
    title: `${displayName} - Solana Template`,
    description: template.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${displayName} - Solana Template`,
      description: template.description,
      type: "website",
      url: canonicalPath,
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
    <div className="relative min-h-screen bg-nd-inverse text-nd-high-em-text">
      <BackgroundShapes />
      <AppProviders>
        <TemplatesProviderWrapper>
          <div className="relative z-10">
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
