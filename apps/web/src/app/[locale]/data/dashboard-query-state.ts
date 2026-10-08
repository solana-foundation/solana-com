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
  parseRangeDays,
  parseTab,
} from "./dashboard-query";
import type { QueryUpdates } from "./dashboard-types";

export function useDashboardQueryParams() {
  const [queryString, setQueryString] = useState("");
  const searchParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );
  const rpcInfra = parseRpcInfra(searchParams.get("infra"));

  useEffect(() => {
    const syncQueryString = () => {
      setQueryString(window.location.search.replace(/^\?/, ""));
    };

    syncQueryString();
    window.addEventListener("popstate", syncQueryString);

    return () => window.removeEventListener("popstate", syncQueryString);
  }, []);

  return {
    activeTab: parseTab(searchParams.get("tab")),
    providerParam: searchParams.get("providers"),
    queryString,
    rangeDays: parseRangeDays(searchParams.get("days")),
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
