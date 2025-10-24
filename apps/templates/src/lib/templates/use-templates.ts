import { Template } from "../types/templates";
import { useTemplatesContext } from "./templates-context";

export function useTemplates(): Template[] {
  return useTemplatesContext();
}
