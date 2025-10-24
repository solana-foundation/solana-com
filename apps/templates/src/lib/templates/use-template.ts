import { useTemplates } from "./use-templates";

export function useTemplate({
  name,
  source,
}: {
  name: string;
  source: string;
}) {
  const templates = useTemplates();

  return templates.find((l) => l.name === name && l.source.id === source);
}
