import { useRouter as usePagesRouter } from "next/compat/router";
import { usePathname } from "next/navigation";

// Compatibility layer for `next/router` in order to support both the pages router and the app router.
export function useRouter() {
  const router = usePagesRouter();
  const pathname = usePathname();
  if (router) {
    return router;
  }
  return {
    // TODO: add locale
    locale: "en",
    asPath: pathname,
    pathname,
    isReady: true,
  };
}
