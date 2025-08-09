let currentLocale = "en";
let currentPathname = "/";

export function __setLocale(locale: string) {
  currentLocale = locale;
}

export function __setPathname(pathname: string) {
  currentPathname = pathname;
}

export function useRouter() {
  return {
    locale: currentLocale,
    asPath: currentPathname,
    pathname: currentPathname,
    isReady: true,
    query: {},
  };
}

export function usePathname() {
  return currentPathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
}
