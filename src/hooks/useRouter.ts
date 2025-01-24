import { useRouter as usePagesRouter } from "next/compat/router";
import { usePathname as useNextPathname } from "next/navigation";
import { usePathname as useI18nPathname } from "@/i18n/routing";
import { useParams } from "next/navigation";

// Compatibility layer for `next/router` in order to support both the pages router and the app router.
export function useRouter() {
  const router = usePagesRouter();
  const pathname = useNextPathname();
  const params = useParams();
  // const searchParams = useSearchParams();
  if (router) {
    // console.log("Using pages router", { pathname, params });
    return router;
  }
  // console.log("Using app router", { pathname, params });
  return {
    locale: params.locale,
    asPath: pathname,
    pathname,
    isReady: true,
    query: {},
  };
}

export function usePathname() {
  // returns the pathname without the locale prefix
  return useI18nPathname();
}
