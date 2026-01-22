"use client";
import React, { useState, useContext } from "react";

// Global settings type (replaces TinaCMS GlobalQuery)
interface GlobalSettings {
  theme: {
    color?: string | null;
    darkMode?: "system" | "light" | "dark" | null;
  };
}

interface LayoutState {
  globalSettings: GlobalSettings | undefined;
  setGlobalSettings: React.Dispatch<
    React.SetStateAction<GlobalSettings | undefined>
  >;
  pageData: Record<string, unknown>;
  setPageData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  theme: GlobalSettings["theme"];
}

const LayoutContext = React.createContext<LayoutState | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  return (
    context || {
      theme: {
        color: "blue",
        darkMode: "system",
      },
      globalSettings: undefined,
      pageData: undefined,
    }
  );
};

interface LayoutProviderProps {
  children: React.ReactNode;
  globalSettings?: GlobalSettings;
  pageData?: Record<string, unknown>;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  globalSettings: initialGlobalSettings,
  pageData: initialPageData,
}) => {
  const [globalSettings, setGlobalSettings] = useState<
    GlobalSettings | undefined
  >(initialGlobalSettings);
  const [pageData, setPageData] = useState<Record<string, unknown>>(
    initialPageData || {}
  );

  const theme = globalSettings?.theme || { color: "blue", darkMode: "system" };

  return (
    <LayoutContext.Provider
      value={{
        globalSettings,
        setGlobalSettings,
        pageData,
        setPageData,
        theme,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
