"use client";

import { createContext, useContext, ReactNode } from "react";
import { Template } from "../types/templates";

const TemplatesContext = createContext<Template[]>([]);

export function TemplatesProvider({
  children,
  templates,
}: {
  children: ReactNode;
  templates: Template[];
}) {
  return (
    <TemplatesContext.Provider value={templates}>
      {children}
    </TemplatesContext.Provider>
  );
}

export function useTemplatesContext() {
  return useContext(TemplatesContext);
}
