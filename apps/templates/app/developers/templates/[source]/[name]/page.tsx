import { TemplatesUiLayoutDetail } from "@/components/templates/templates-ui-layout-detail";
import { templates } from "@/lib/generated/repokit";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string; source: string }>;
}): Promise<Metadata> {
  const { name, source } = await params;

  const template = templates.find(
    (t) => t.name === name && t.source.id === source,
  );

  if (!template) {
    return {
      title: "Template Not Found",
      description: "The requested template could not be found.",
    };
  }

  return {
    title: `${template.name} - Solana Template`,
    description: template.description,
    openGraph: {
      title: `${template.name} - Solana Template`,
      description: template.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.name} - Solana Template`,
      description: template.description,
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ name: string; source: string }>;
}) {
  const { name, source } = await params;

  return <TemplatesUiLayoutDetail name={name} source={source} />;
}
