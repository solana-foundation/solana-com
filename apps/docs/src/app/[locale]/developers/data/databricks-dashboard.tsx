"use client";

import { DatabricksDashboard } from "@databricks/aibi-client";
import { useEffect, useRef, useState } from "react";

type TokenResponse = {
  token: string;
  instanceUrl: string;
  workspaceId: string;
  dashboardId: string;
};

export const DatabricksDashboardEmbed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeDashboard = async () => {
      try {
        const response = await fetch("/api/databricks/scoped-token");
        const data = (await response.json()) as TokenResponse & {
          error?: string;
        };

        if (!response.ok || data.error) {
          throw new Error(data.error ?? "Failed to fetch scoped token");
        }

        if (!containerRef.current) {
          return;
        }

        const dashboard = new DatabricksDashboard({
          instanceUrl: data.instanceUrl,
          workspaceId: data.workspaceId,
          dashboardId: data.dashboardId,
          token: data.token,
          container: containerRef.current,
          config: {
            version: 1,
            hideDatabricksLogo: true,
          },
        });

        await dashboard.initialize();
      } catch (initializationError) {
        if (!isMounted) {
          return;
        }

        const message =
          initializationError instanceof Error
            ? initializationError.message
            : "Failed to initialize Databricks dashboard";
        setError(message);
      }
    };

    void initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto h-[calc(100vh-120px)] min-h-[640px] w-full max-w-none"
    />
  );
};
