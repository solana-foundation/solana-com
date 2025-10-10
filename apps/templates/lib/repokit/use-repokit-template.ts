import { useRepokitTemplates } from "./use-repokit-templates";

export function useRepokitTemplate({
  name,
  source,
}: {
  name: string;
  source: string;
}) {
  const templates = useRepokitTemplates();

  return templates.find((l) => l.name === name && l.source.id === source);
}
