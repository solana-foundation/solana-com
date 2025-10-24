"use client";

import { useState, useEffect, ReactNode } from "react";
import { Template } from "../../lib/types/templates";
import { TemplatesProvider } from "../../lib/templates/templates-context";
import { fetchTemplatesFromGitHub } from "../../lib/fetch-templates";

export function TemplatesProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplatesFromGitHub()
      .then(setTemplates)
      .catch((error) => {
        console.error("Failed to fetch templates:", error);
        setTemplates([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <TemplatesProvider templates={templates}>{children}</TemplatesProvider>
  );
}
