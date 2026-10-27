"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "@workspace/i18n/routing";
import {
  parseRpcInfra,
  parseRpcMethod,
  parseRpcRegion,
  parseRpcTimeframe,
  type ProviderName,
} from "./data-config";
import {
  applyQueryUpdates,
  getDashboardUrl,
  getLinkedChart,
  parseTab,
} from "./dashboard-query";
import { getUtcToday, parseDashboardRange } from "./date-range";
import type { QueryUpdates } from "./dashboard-types";

export function useDashboardQueryParams() {
  const [queryString, setQueryString] = useState("");
  const [linkedChartId, setLinkedChartId] = useState<string>();
  const searchParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );
  const rpcInfra = parseRpcInfra(searchParams.get("infra"));
  const range = useMemo(
    () => parseDashboardRange(searchParams, getUtcToday()),
    [searchParams],
  );

  useEffect(() => {
    const syncQueryString = () => {
      setQueryString(window.location.search.replace(/^\?/, ""));
      setLinkedChartId(getLinkedChart(window.location.hash)?.id);
    };

    syncQueryString();
    window.addEventListener("popstate", syncQueryString);
    window.addEventListener("hashchange", syncQueryString);

    return () => {
      window.removeEventListener("popstate", syncQueryString);
      window.removeEventListener("hashchange", syncQueryString);
    };
  }, []);

  return {
    activeTab: parseTab(searchParams.get("tab")),
    /** Chart named by the URL's #chart-id, to scroll to once it renders. */
    linkedChartId,
    providerParam: searchParams.get("providers"),
    queryString,
    range,
    rpcInfra,
    rpcMethod: parseRpcMethod(searchParams.get("method")),
    rpcRegion: parseRpcRegion(searchParams.get("region"), rpcInfra),
    rpcTimeframe: parseRpcTimeframe(searchParams.get("timeframe")),
    setQueryString,
  };
}

export function useDashboardQueryUpdater(
  availableProviders: readonly ProviderName[],
  queryString: string,
  setQueryString: (_queryString: string) => void,
) {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (updates: QueryUpdates) => {
      const params = new URLSearchParams(queryString);

      applyQueryUpdates(params, updates, availableProviders);
      setQueryString(params.toString());
      router.replace(getDashboardUrl(pathname, params), { scroll: false });
    },
    [availableProviders, pathname, queryString, router, setQueryString],
  );
}
