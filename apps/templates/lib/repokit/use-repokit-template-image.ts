import { images, RepokitTemplate } from "@/lib/generated/repokit";

export function useRepokitTemplateImage({
  template,
}: {
  template: RepokitTemplate;
}) {
  const image = images[`${template.source.id}-${template.name}`];

  return image ?? null;
}
